import {useParams} from "react-router";
import React, {Suspense, useContext, useEffect, useRef, useState} from "react";
import {ISolutionStatus, ITask} from "../models/ITask";
import {IGroupRole} from "../models/IGroupRole";
import {
    Box,
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {ISolution} from "../models/ISolution";
import fileDialog from "file-dialog";
import SolutionService from "../services/SolutionService";
import GroupService from "../services/GroupService";
import TaskService from "../services/TaskService";
import {Layout} from "../components/layouts/Layout";
import {TaskAttachment} from "../components/TaskAttachment";
import {TaskInfo} from "../components/TaskInfo";
import {BiSend, GoFileCode} from "react-icons/all";
import {BorderShadowBox} from "../components/BorderShadowBox";
import {SolutionInfo} from "../components/SolutionInfo";
import {TaskStudentsList} from "../components/TaskStudentsList";
import {BaseSpinner} from "../components/BaseSpinner";
import Dropzone from "react-dropzone";
import { useNavigate } from 'react-router-dom';

import { RootStoreContext } from "../context";
import { observer } from "mobx-react-lite";
import {IUser} from "../models/IUser";

// @ts-ignore
//const Chat = React.lazy(() => import('chat/App'));

const TaskPage = observer(() => {
    const RS = useContext(RootStoreContext);
    const {groupId, courseId, lessonId, taskId} = useParams();
    const [task, setTask] = useState<ITask>()
    const [groupRole, setGroupRole] = useState<IGroupRole>()
    const {current_solution, isChanged: solutionIsChanged} = RS.solutionStore;
    const {user} = RS.authStore;
    const {selectedUser, setSelectedUser} = RS.selectedUserStore;

    const {isOpen, onOpen, onClose} = useDisclosure()
    const [solutions, setSolutions] = useState<ISolution[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const [asideChildWidthStudentsList, setAsideChildWidthStudentsList] = useState<React.ReactNode>()
    const ws = useRef<WebSocket>()

    const updateSolutionsList = (user: IUser) => {
        //console.log(selectedUser)
        if (selectedUser)
            SolutionService.getAllTaskSolutionsByUserId(groupId!, courseId!, taskId!, user.id).then((solutions) => {
                setSolutions(solutions.reverse())
            })
    }

    const sendFileFromDialog = () => {
        fileDialog().then(async (files) => {
            sendFile(files[0])
        })
    }

    const sendFile = (file: File) => {
        SolutionService.postSolution(groupId!, courseId!, lessonId!, taskId!, file)
            .then((solution) => RS.solutionStore.setSolution(solution))
    }

    useEffect(() => {
        GroupService.getGroupRole(groupId!).then((role) => setGroupRole(role))
        TaskService.getTask(groupId!, courseId!, lessonId!, taskId!)
            .then((task) => setTask(task))
            .catch((error) => {
                if (error.response.status === 403) {
                    navigate("/page_not_found_404")
                }
            })
    }, [])

    useEffect(() => {
        if (groupRole === IGroupRole.STUDENT) {
            RS.selectedUserStore.setSelectedUser(user!)
            SolutionService.getBestSolution(groupId!, courseId!, taskId!).then((solution) => {
                if (solution)
                    RS.solutionStore.setSolution(solution)
                else
                    RS.solutionStore.setSolution({
                        id: -1,
                        score: 0,
                        status: ISolutionStatus.UNDEFINED,
                        code: "",
                        time_start: new Date
                    } as ISolution)
            })
        } else if (groupRole === IGroupRole.TEACHER || groupRole === IGroupRole.OWNER) {
            setAsideChildWidthStudentsList(
                <TaskStudentsList/>
            )
        }
        setIsLoading(false)
    }, [groupRole])

    useEffect(() => {
        selectedUser && updateSolutionsList(selectedUser)
    }, [selectedUser])
    useEffect(() => {
        return () => {
            RS.solutionStore.clearSolution()
            RS.selectedUserStore.clearSelectedUser()
        }
    }, [])
    useEffect(()=> {
        ws.current = new WebSocket(`wss://taskcheckingsystem.ru/api_v1//solution/${taskId}/${user?.id}/${courseId}/${groupId}`)
        //console.log(ws.current)
        const wsCurrent = ws.current
        return () => {
            console.log(ws.current)
            wsCurrent.close()
        }
    }, [])
    useEffect(() => {
        //console.log("state", selectedUser)
        if (selectedUser && ws.current) {
            ws.current.onmessage = function (event) {
                // TODO: rework with store changes when onmessage ws
                const t = JSON.parse(String(event.data)) as ISolution
                //console.log(t, typeof t)

                updateSolutionsList(selectedUser)

                // RS.solutionStore.setSolution(JSON.parse(event.data) as ISolution)
            }
        }
    }, [selectedUser, ws.current])

    if (isLoading) {
        return <BaseSpinner/>;
    }
    return (
        <Dropzone
            onDrop={acceptedFiles => sendFile(acceptedFiles[0])}
        >
            {({getRootProps, isDragActive, getInputProps}) => (
                <div>
                    <Layout
                        gridTemplateColumns={"4fr 1fr"}
                        headerChildren={
                            <>
                                <Heading mb={2}>{task?.name}</Heading>
                                <>
                                    <Button
                                        onClick={() => onOpen()}
                                        key={"lg"}
                                        mb={4}
                                    >{`Условие задачи`}</Button>
                                    <Drawer onClose={onClose}
                                            isOpen={isOpen}
                                            size={"lg"}
                                    >
                                        <DrawerOverlay/>
                                        <DrawerContent borderRadius="3px">
                                            <DrawerCloseButton/>
                                            <DrawerHeader fontSize="4xl"
                                                          borderBottomWidth="1px"
                                            >
                                                {task?.name}
                                            </DrawerHeader>
                                            <DrawerBody>
                                                <Text style={{whiteSpace: "pre-wrap"}} fontSize="lg">{task?.description}</Text>
                                                <br/>
                                                {task?.attachments && task?.attachments.length > 0 && (
                                                    <Heading>Вложения</Heading>
                                                )}
                                                {task?.attachments?.map((v, index) => (
                                                    <TaskAttachment key={index} {...v} />
                                                ))
                                                }
                                            </DrawerBody>
                                        </DrawerContent>
                                    </Drawer>
                                </>
                            </>
                        }
                        mainChildren={isDragActive && groupRole === IGroupRole.STUDENT ?
                            <Box style={{height: "100vh", width: "100vh"}}
                                 fontSize={"xxx-large"}
                                 verticalAlign={"middle"}
                                 textAlign={"center"}
                                 borderStyle={"dashed solid"}
                                 borderWidth={3}
                            >
                                {/*<input {...getInputProps()} />*/}
                                <Text>Drop Here!</Text>
                            </Box>
                            :
                            <Layout
                                noPadding
                                mainChildren={
                                    <>
                                        {current_solution && task &&
                                            <TaskInfo
                                                status={current_solution.status}
                                                points={current_solution.score}
                                                maxPoints={task.max_score}
                                                date={current_solution.time_start}
                                                code={current_solution.code}
                                                groupRole={groupRole!}
                                            />
                                        }
                                    </>
                                }
                                asideChildren={
                                    <>
                                        {groupRole === IGroupRole.STUDENT &&
                                            <div>
                                                <Button onClick={async () => {
                                                    await SolutionService.postSolutionCode(groupId!, courseId!, lessonId!, taskId!, current_solution!.code)
                                                    // window.location.reload()
                                                }}
                                                        mb={2}
                                                        width={"100%"}
                                                        isDisabled={!solutionIsChanged}
                                                >
                                                    Отправить решение
                                                    <Icon
                                                        as={BiSend}
                                                        textAlign="center"
                                                        w="6"
                                                        h="6"
                                                    />
                                                </Button>

                                                <Button onClick={sendFileFromDialog}
                                                        mb={2}
                                                        width={"100%"}
                                                >
                                                    Прикрепить решение
                                                    <Icon
                                                        as={GoFileCode}
                                                        textAlign="center"
                                                        w="6"
                                                        h="6"
                                                    />
                                                </Button>
                                            </div>
                                        }
                                        <BorderShadowBox width={"100%"}>
                                            <Tabs isFitted>
                                                <TabList mb='1em'>
                                                    <Tab>Решения</Tab>
                                                    <Tab>Чат</Tab>
                                                </TabList>
                                                <TabPanels>
                                                    <TabPanel>
                                                        <Flex maxH="60vh" direction="column"
                                                              overflowY={"scroll"} width={"100%"}
                                                              mb={2}
                                                              overflow={"auto"} sx={{
                                                            '&::-webkit-scrollbar': {
                                                                width: '16px',
                                                                borderRadius: '8px',
                                                                backgroundColor: `rgba(170, 170, 170, 0.05)`,
                                                            },
                                                            '&::-webkit-scrollbar-thumb': {
                                                                width: '16px',
                                                                borderRadius: '8px',
                                                                backgroundColor: `rgba(170, 170, 170, 0.05)`,
                                                            },
                                                        }}>
                                                            {solutions.length > 0
                                                                ?
                                                                solutions.map((solution, index) => {
                                                                    return <SolutionInfo {...solution}
                                                                                         max_score={task?.max_score!}
                                                                                         key={index}/>
                                                                })
                                                                :
                                                                <Center>
                                                                    <Text>Решений нет</Text>
                                                                </Center>
                                                            }
                                                        </Flex>
                                                    </TabPanel>
                                                    <TabPanel>
                                                        <Suspense>
                                                            {/*<Chat selectedUser={selectedUser} authUser={user}/>*/}
                                                        </Suspense>
                                                    </TabPanel>
                                                </TabPanels>
                                            </Tabs>
                                        </BorderShadowBox>
                                    </>
                                }
                            />
                        }
                        asideChildren={
                            asideChildWidthStudentsList
                        }
                    />
                </div>
            )}
        </Dropzone>
    )
})

export default TaskPage;