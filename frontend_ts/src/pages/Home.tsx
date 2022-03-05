import React, {FunctionComponent, useEffect, useState} from 'react';
import CourseService from "../api/CourseService";
import {IGroup} from "../models/IGroup";
import {ICourses} from "../models/ICourses";
import {ICourse} from "../models/ICourse";

const Home: FunctionComponent = () => {
    const [courses, setCourses] = useState<ICourses[]>([])
    useEffect(() => {
        (async () => {
            const groups = await CourseService.getGroups()
            const c = (await CourseService.getGroupCourses(1)).data
            const courses: ICourse[] = (await Promise.all(groups.data.map(async (group) => {
                return (await CourseService.getGroupCourses(group.id)).data
            }))).flat()
            console.log(courses)
        })();
    }, []);
    return (
        <div>
            HomePage
        </div>
    );
};

export default Home;