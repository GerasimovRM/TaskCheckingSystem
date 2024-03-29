import React, {FunctionComponent, useEffect, useState} from 'react';
import ProfileCourseStatForStudent from "../components/ProfileCourseStatForStudent";
import {IGroupRole} from "../models/IGroupRole";
import GroupService from "../services/GroupService";
import {useParams} from "react-router";
import ProfileCourseStatForTeacher from "../components/ProfileCourseStatForTeacher";
import {Layout} from "../components/layouts/Layout";

const ProfileCourseStatPage: FunctionComponent = () => {
    const {groupId, courseId} = useParams()
    const [groupRole, setGroupRole] = useState<IGroupRole>()

    useEffect(() => {
        GroupService.getGroupRole(groupId!).then((role) => {
            setGroupRole(role)
        })
    })

    return (
        <Layout mainChildren={groupRole! === IGroupRole.TEACHER ?
            <ProfileCourseStatForTeacher/>
            :
            <ProfileCourseStatForStudent/>
        }
        />
    );

}

export default ProfileCourseStatPage;