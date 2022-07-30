import styles from '@/styles/files-navigation.module.css';

export default function FilesNavigation(){
   return (
    <section className={styles['files-navigation']}>
        <ul className="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-0" id="tabs-tab" role="tablist">
            <li className="nav-item" role="presentation">
                <a key='Program' href="#tabs-main" className="nav-link block font-medium text-xs leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent active " 
                id="tabs-home-tab" data-bs-toggle="pill" data-bs-target="#tabs-main" role="tab" aria-selected="true">Program</a>
            </li>
        </ul>
    </section>);
}