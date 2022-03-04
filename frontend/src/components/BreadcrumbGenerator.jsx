import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Link,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { baseURL } from '../api/api';

export default function BreadcrumbGenerator() {
  const location = useLocation();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const pathLinks = ['Home']
      .concat(
        location.pathname.split('/').map((s) => {
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        }),
      )
      .filter((s) => isNaN(s));
    const hrefs = location.pathname.split('/');
    for (let i = 0; i < hrefs.length; i++) {
      if (!isNaN(hrefs[i + 1])) {
        hrefs[i] = hrefs.slice(i, i + 2).join('/');
        hrefs.splice(i + 1, 1);
        i--;
      }
    }
    const breadcrumps = pathLinks.map((link, i) => {
      return (
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`${baseURL}${hrefs.slice(0, 1 + i).join('/')}`}
          >
            {link}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    });
    setLinks(breadcrumps);
  }, [location.pathname]);
  return (
    <>
      <Breadcrumb separator={<ChevronRightIcon />}>{links}</Breadcrumb>
    </>
  );
}
