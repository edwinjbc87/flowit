import { RootState, useAppDispatch } from "store"
import { useSelector } from "react-redux"
import { Diagram } from "@/entities/Diagram"
import { setDiagram, setProject, setCurrentModule, setExecution } from "store/slices/programSlice"
import { Project } from "@/entities/Project"
import { ProgramExecution } from "@/entities/ProgramExecution"

export default function useProgram() {
    const dispatch = useAppDispatch();
    const project = useSelector((state: RootState) => state.program.project);
    const currentModuleIndex = useSelector((state: RootState) => state.program.currentModuleIndex);
    const diagram = useSelector<RootState, Diagram>(state => state.program.diagram)
    const execution = useSelector<RootState, ProgramExecution>(state => state.program.execution)

    const _setDiagram = async (diagram: Diagram) => await dispatch(setDiagram(diagram));
    const _setProject = async (project: Project) => await dispatch(setProject(project));
    const _setCurrentModule = async (name: string) => await dispatch(setCurrentModule(name));
    const getCurrentModule = () => project.modules[currentModuleIndex];
    const runProgram = async () => {
        await dispatch(setExecution({ isRunning: true }))
        await new Promise(resolve => setTimeout(resolve, 5000))
        await dispatch(setExecution({ isRunning: false }))
    }

    return {project, diagram, execution, handler: {setDiagram: _setDiagram, setProject: _setProject, setCurrentModule: _setCurrentModule, getCurrentModule, runProgram}}
}