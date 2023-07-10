import {SolutionState} from "./types";
import {ISolution} from "../../models/ISolution";
import SolutionService from "../../services/SolutionService";
import {makeAutoObservable} from "mobx";

export default class SolutionStore implements SolutionState {
    current_solution?: ISolution = undefined;
    isLoading: boolean = false;
    error?: string = undefined;
    isChanged: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    clearSolution() {
        this.current_solution = undefined;
        this.isLoading = false;
        this.error = undefined;
        this.isChanged = false;
    }

    setSolution(solution: ISolution) {
        this.current_solution = solution;
        this.isLoading = false;
        this.isChanged = false;
    }

    setSolutionError(error: string) {
        this.error = error;
        this.isChanged = false;
        this.isLoading = false;
    }

    setSolutionIsLoading(state: boolean) {
        this.isLoading = state;
    }

    setSolutionCode(code: string) {
        this.current_solution = {...this.current_solution, code: code} as ISolution;
    }

    setSolutionScore(score: number) {
        this.current_solution = {...this.current_solution, score: score} as ISolution;
    }

    setSolutionIsChanged(state: boolean) {
        this.isChanged = state;
    }

    async fetchBestSolution(groupId: number | string,
                            courseId: number | string,
                            taskId: number | string,
                            user_id?: number | string) {
        this.isLoading = true;
        if (user_id) {
            const response = await SolutionService.getBestSolution(groupId, courseId, taskId, user_id)
            this.setSolution(response!);
        } else {
            const response = await SolutionService.getBestSolution(groupId, courseId, taskId)
            this.setSolution(response!);
        }
    }
}