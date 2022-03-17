import React, {ReactElement, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { baseURL } from '../api/api';
import Common from "../api/Common";

export default function BreadcrumbGenerator(): ReactElement {
    const location = useLocation();
    const [links, setLinks] = useState<ReactElement[]>();

    useEffect(() => {
        const pathLinks = ['Home']
            .concat(
                location.pathname.split('/').map((s) => {
                    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                }),
            )
            .filter((s) => !Common.isNumeric(s) && s !== "");
        const hrefs = location.pathname.split('/');
        for (let i = 0; i < hrefs.length; i++) {
            if (Common.isNumeric(hrefs[i + 1])) {
                hrefs[i] = hrefs.slice(i, i + 2).join('/');
                hrefs.splice(i + 1, 1);
                i--;
            }
        }
        const breadcrumps: ReactElement[] = pathLinks.map((link, i) => {
            return (
                <BreadcrumbItem key={`${baseURL}${hrefs.slice(0, 1 + i).join('/')}`} isCurrentPage={i + 1 === pathLinks.length}>
                    <BreadcrumbLink as={Link} to={`${hrefs.slice(0, 1 + i).join('/')}`} >
                        <Text fontSize="3xl">{link}</Text>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            );
        });
        setLinks(breadcrumps);
    }, [location.pathname]);
    return (
        <>
            <Breadcrumb key="bread" separator={<ChevronRightIcon />}>{links}</Breadcrumb>
        </>
);
}
