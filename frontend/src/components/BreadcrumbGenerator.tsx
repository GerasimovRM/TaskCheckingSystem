import React, {ReactElement, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink, Center, Icon,
    Text
} from '@chakra-ui/react';
import {ChevronRightIcon} from '@chakra-ui/icons';
import {baseURL} from '../api/api';
import Common from "../api/Common";
import {BiErrorAlt, BiGroup, BiHomeSmile, BiTask, FaTasks, FiSettings, ImBooks, ImProfile} from 'react-icons/all';
import {IconType} from "react-icons";

interface IconsInterface {
    [key: string]: IconType
}

export default function BreadcrumbGenerator(): ReactElement {
    const location = useLocation();
    const [links, setLinks] = useState<ReactElement[]>();

    useEffect(() => {
        const icons: IconsInterface = {
            "Home": BiHomeSmile,
            "Group": BiGroup,
            "Course": ImBooks,
            "Lesson": FaTasks,
            "Task": BiTask,
            "Settings": FiSettings,
            "Profile": ImProfile
        }
        const pathLinks = ['Home']
            .concat(
                location.pathname.split('/').map((s) => {
                    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                }),
            )
            .filter((s) => !Common.isNumeric(s) && s !== "");
        const hrefs = location.pathname.split('/');
        console.log(hrefs)
        for (let i = 0; i < hrefs.length; i++) {
            if (Common.isNumeric(hrefs[i + 1])) {
                hrefs[i] = hrefs.slice(i, i + 2).join('/');
                hrefs.splice(i + 1, 1);
                i--;
            }
        }
        console.log(hrefs.slice(0, 3).join('/'))
        // console.log(pathLinks)
        const breadcrumps: ReactElement[] = pathLinks.map((link, i) => {
            return (
                <BreadcrumbItem key={i}
                                isCurrentPage={i + 1 === pathLinks.length}>
                    <BreadcrumbLink as={Link} to={`${i === 0 ? "/" : hrefs.slice(0, 1 + i).join('/')}`}>
                        <Center>
                            <Icon as={ icons[link] ? icons[link] : BiErrorAlt } fontSize="3xl"/>
                        </Center>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            );
        });
        setLinks(breadcrumps);
    }, [location.pathname]);
    return (
        <Breadcrumb key="bread"
                    separator={<ChevronRightIcon/>}>
            {links}
        </Breadcrumb>
    );
}
