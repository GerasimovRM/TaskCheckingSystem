from database import get_sync_session, Task

session = get_sync_session()

tasks = session.query(Task).all()
for task in tasks:
    if task.attachments:
        new_attachments = []
        for attachment in task.attachments:
            if attachment["attachment_type"] == "input_output":
                attachment["data"]["input"]: str
                new_attachments.append({'attachment_type': 'input_output',
                                        'data': {
                                            'input': attachment["data"]["input"],
                                            'output': "\n".join(map(lambda x: x.replace("\n", ""), attachment["data"]["output"].rsplit("\n\n")))}
                                        })
        task.attachments = new_attachments
session.commit()
