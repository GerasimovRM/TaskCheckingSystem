import React, { useState } from 'react';

import {
    Box,
    Button,
    Heading,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';

export default function NotFoundPage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [buttonText, setButtonText] = useState('Понял');
    const closeHelper = () => {
        setButtonText('Понял');
        onClose();
    };
    return (
        <>
            <Box textAlign="center" py={10} px={6}>
                <Heading
                    display="inline-block"
                    as="h2"
                    size="2xl"
                    bgGradient="linear(to-r, blue.400, blue.600)"
                    backgroundClip="text"
                >
                    404
                </Heading>
                <Text fontSize="18px" mt={3} mb={2}>
                    Страница не найдена
                </Text>
                <Text color="gray.500" mb={6}>
                    Страница, которую вы ищете, похоже, не существует
                </Text>
                <Link href="/">
                    <Button
                        colorScheme="blue"
                        bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
                        color="white"
                        variant="solid"
                    >
                        Вернуться на домашнюю
                    </Button>
                </Link>
                <br />
                <br />
                <Button
                    colorScheme="blue"
                    bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
                    color="white"
                    variant="solid"
                    onClick={onOpen}
                >
                    ПОМОГИТЕ :(
                </Button>
                <Modal isOpen={isOpen} onClose={closeHelper}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Виджет помощи</ModalHeader>
                        <ModalBody>
                            Exorcizo te, immundissime spiritus, omnis incursio adversarii,
                            omne phantasma, omnis legio, in nomine Domini nostri Jesu Christi
                            eradicare, et effugare ab hoc plasmate Dei. Ipse tibi imperat, qui
                            te de supernis caelorum in inferiora terrae demergi praecepit.
                            Ipse tibi imperat, qui mari, ventis, et tempestatibus impersvit.
                            Audi ergo, et time, satana, inimice fidei, hostis generis humani,
                            mortis adductor, vitae raptor, justitiae declinator, malorum
                            radix, fomes vitiorum, seductor hominum, proditor gentium,
                            incitator invidiae, origo avaritiae, causa discordiae, excitator
                            dolorum: quid stas, et resistis, cum scias. Christum Dominum vias
                            tuas perdere? Illum metue, qui in Isaac immolatus est, in joseph
                            venumdatus, in sgno occisus, in homine cruci- fixus, deinde
                            inferni triumphator fuit. Sequentes cruces fiant in fronte
                            obsessi. Recede ergo in nomine Patris et Filii, et Spiritus
                            Sancti: da locum Spiritui Sancto, per hoc signum sanctae Cruci
                            Jesu Christi Domini nostri: Qui cum Patre et eodem Spiritu Sancto
                            vivit et regnat Deus, Per omnia saecula saeculorum. Et cum spiritu
                            tuo. Amen.
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={() => {
                                    if (buttonText === 'Понял') {
                                        setButtonText('Принял');
                                    } else {
                                        closeHelper();
                                    }
                                }}
                            >
                                {buttonText}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    );
}
