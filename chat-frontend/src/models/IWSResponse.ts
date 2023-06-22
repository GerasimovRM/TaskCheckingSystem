import { WSEvents } from "../common/WSEvents"
import { IChatMessage } from "./IChatMessage"

export default interface IWSResponse {
    event: WSEvents,
    auth?: string,
    data: IChatMessage
}