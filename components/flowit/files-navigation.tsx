import useProgram from '@/hooks/useProgram';
import styles from '@/styles/files-navigation.module.css';

export default function FilesNavigation() {
    const {project, handler} = useProgram();


   return (
    <section className={styles['files-navigation']}>
        <ul className="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-0" id="tabs-tab" role="tablist">
            {project.modules.map(m => (
                <li className="nav-item" role="presentation" key={`li-${m.name}`}>
                    <a 
                        key={m.name} 
                        href={`#tabs-${m.name}`}
                        className={`nav-link block font-medium text-xs leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent ${m.name == handler.getCurrentModule()?.name ? 'active' : ''}`} onClick={() => handler.setCurrentModule(m.name)}
                        id="tabs-home-tab" 
                        data-bs-toggle="pill" 
                        data-bs-target={`#tabs-${m.name}`}
                        role="tab" aria-selected="true"
                    >
                        {m.name}
                    </a>
                </li>
            ))}
        </ul>
    </section>);
}