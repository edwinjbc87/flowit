import { RootState, useAppDispatch } from "store"
import { useSelector } from "react-redux"
import { Diagram } from "@/entities/Diagram"
import { setDiagram, setProject, setCurrentModule } from "store/slices/programSlice"
import { Project } from "@/entities/Project"

export default function useProgram() {
    const dispatch = useAppDispatch();
    const project = useSelector((state: RootState) => state.program.project);
    const currentModuleIndex = useSelector((state: RootState) => state.program.currentModuleIndex);
    const diagram = useSelector<RootState, Diagram>(state => state.program.diagram)

    const _setDiagram = async (diagram: Diagram) => await dispatch(setDiagram(diagram));
    const _setProject = async (project: Project) => await dispatch(setProject(project));
    const _setCurrentModule = async (name: string) => await dispatch(setCurrentModule(name));
    const getCurrentModule = () => project.modules[currentModuleIndex];

    return {project, diagram, handler: {setDiagram: _setDiagram, setProject: _setProject, setCurrentModule: _setCurrentModule, getCurrentModule}}
}