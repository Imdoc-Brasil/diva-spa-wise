
import React, { useState } from 'react';
import { DriveItem, DriveFileType } from '../../types';
import { Folder, FileText, Image as ImageIcon, Table, MoreVertical, Search, Star, Upload, Cloud, Grid, List, Download, Trash2, Eye, ChevronRight, HardDrive, Plus } from 'lucide-react';

const mockDriveItems: DriveItem[] = [
    { id: 'f1', name: 'Marketing', type: 'folder', updatedAt: '2023-10-25', owner: 'Admin', starred: true, path: [] },
    { id: 'f2', name: 'Contratos & Legal', type: 'folder', updatedAt: '2023-10-20', owner: 'Admin', starred: false, path: [] },
    { id: 'f3', name: 'Protocolos Clínicos', type: 'folder', updatedAt: '2023-09-15', owner: 'Dra. Julia', starred: true, path: [] },
    { id: 'f4', name: 'Financeiro 2023', type: 'folder', updatedAt: '2023-10-01', owner: 'Financeiro', starred: false, path: [] },
    { id: 'd1', name: 'Manual Laser Galaxy.pdf', type: 'pdf', size: '4.5 MB', updatedAt: '2023-08-10', owner: 'Dra. Julia', starred: false, path: [] },
    { id: 'd2', name: 'Campanha Verão.jpg', type: 'image', size: '2.1 MB', updatedAt: '2023-10-26', owner: 'Mkt', starred: false, path: [], thumbnailUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=100' },
    { id: 'd3', name: 'Controle Estoque.xlsx', type: 'sheet', size: '150 KB', updatedAt: '2023-10-27', owner: 'Admin', starred: false, path: [] },
    // Items inside Marketing folder (mocked by logic)
];

const DriveModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPath, setCurrentPath] = useState<{id: string, name: string}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSidebar, setActiveSidebar] = useState<'my_drive' | 'starred' | 'trash'>('my_drive');

  // Mock Navigation Logic
  const handleFolderClick = (folder: DriveItem) => {
      setCurrentPath([...currentPath, { id: folder.id, name: folder.name }]);
      // In a real app, we would fetch items for this folder ID
  };

  const handleBreadcrumbClick = (index: number) => {
      setCurrentPath(currentPath.slice(0, index + 1));
  };

  const goRoot = () => setCurrentPath([]);

  // Filter Logic
  const getFilteredItems = () => {
      // In a real app, this would filter by parentID = currentFolderID
      // Here we just show everything at root if path is empty, or empty if path is set (mock)
      if (searchTerm) {
          return mockDriveItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      
      if (activeSidebar === 'starred') {
          return mockDriveItems.filter(i => i.starred);
      }

      if (currentPath.length === 0) {
          return mockDriveItems;
      }
      return []; // Mock empty folder for demo
  };

  const items = getFilteredItems();

  const getIcon = (type: DriveFileType) => {
      switch(type) {
          case 'folder': return <Folder size={40} className="text-diva-primary fill-diva-primary/20" />;
          case 'pdf': return <FileText size={40} className="text-red-500" />;
          case 'image': return <ImageIcon size={40} className="text-purple-500" />;
          case 'sheet': return <Table size={40} className="text-green-500" />;
          default: return <FileText size={40} className="text-gray-400" />;
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-diva-light/30 shadow-sm shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                    <HardDrive size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-diva-dark">Diva Drive</h2>
                    <p className="text-sm text-gray-500">Gestão Eletrônica de Documentos (GED)</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar arquivos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-diva-primary outline-none" 
                    />
                </div>
                <button className="bg-diva-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-diva-dark transition-colors shadow-md">
                    <Upload size={16} className="mr-2" /> Upload
                </button>
            </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-64 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col p-4 shrink-0">
                <button className="w-full py-3 bg-diva-light/10 text-diva-dark rounded-lg text-sm font-bold flex items-center justify-center mb-6 hover:bg-diva-light/20 transition-colors">
                    <Plus size={16} className="mr-2" /> Nova Pasta
                </button>

                <div className="space-y-1 flex-1">
                    <button 
                        onClick={() => setActiveSidebar('my_drive')}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSidebar === 'my_drive' ? 'bg-diva-primary/10 text-diva-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <HardDrive size={16} className="mr-3" /> Meu Drive
                    </button>
                    <button 
                        onClick={() => setActiveSidebar('starred')}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSidebar === 'starred' ? 'bg-diva-primary/10 text-diva-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Star size={16} className="mr-3" /> Favoritos
                    </button>
                    <button 
                        onClick={() => setActiveSidebar('trash')}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSidebar === 'trash' ? 'bg-diva-primary/10 text-diva-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Trash2 size={16} className="mr-3" /> Lixeira
                    </button>
                </div>

                {/* Storage Meter */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                        <Cloud size={16} />
                        <span className="text-xs font-bold">Armazenamento</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-diva-accent w-[45%]"></div>
                    </div>
                    <p className="text-[10px] text-gray-400">45 GB de 100 GB usados</p>
                </div>
            </div>

            {/* File Browser */}
            <div className="flex-1 bg-white rounded-xl border border-diva-light/30 shadow-sm flex flex-col overflow-hidden">
                
                {/* Breadcrumbs & View Toggle */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center text-sm text-gray-600">
                        <button onClick={goRoot} className={`hover:text-diva-dark font-medium ${currentPath.length === 0 ? 'text-diva-dark font-bold' : ''}`}>
                            Meu Drive
                        </button>
                        {currentPath.map((folder, idx) => (
                            <div key={folder.id} className="flex items-center">
                                <ChevronRight size={14} className="mx-2 text-gray-400" />
                                <button 
                                    onClick={() => handleBreadcrumbClick(idx)}
                                    className={`hover:text-diva-dark font-medium ${idx === currentPath.length - 1 ? 'text-diva-dark font-bold' : ''}`}
                                >
                                    {folder.name}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-diva-dark' : 'text-gray-400 hover:text-gray-600'}`}>
                            <Grid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-diva-dark' : 'text-gray-400 hover:text-gray-600'}`}>
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Folder size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">Pasta vazia</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {items.map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => item.type === 'folder' ? handleFolderClick(item) : null}
                                    className="group border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center hover:border-diva-primary hover:shadow-md transition-all cursor-pointer relative"
                                >
                                    <div className="mb-3 transition-transform group-hover:scale-110">
                                        {getIcon(item.type)}
                                    </div>
                                    <p className="text-xs font-medium text-gray-700 truncate w-full">{item.name}</p>
                                    {item.type !== 'folder' && <p className="text-[9px] text-gray-400 mt-1">{item.size}</p>}
                                    
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><MoreVertical size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-2 font-medium w-10"></th>
                                    <th className="px-4 py-2">Nome</th>
                                    <th className="px-4 py-2">Tamanho</th>
                                    <th className="px-4 py-2">Modificado</th>
                                    <th className="px-4 py-2">Proprietário</th>
                                    <th className="px-4 py-2 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-50">
                                {items.map(item => (
                                    <tr 
                                        key={item.id} 
                                        onClick={() => item.type === 'folder' ? handleFolderClick(item) : null}
                                        className="hover:bg-gray-50 cursor-pointer group"
                                    >
                                        <td className="px-4 py-3">
                                            {item.type === 'folder' ? <Folder size={20} className="text-diva-primary fill-diva-primary/20" /> : 
                                             item.type === 'pdf' ? <FileText size={20} className="text-red-500" /> : 
                                             item.type === 'image' ? <ImageIcon size={20} className="text-purple-500" /> : <Table size={20} className="text-green-500" />}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{item.size || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{item.updatedAt}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{item.owner}</td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100">
                                            <button className="p-1.5 text-gray-400 hover:text-diva-dark hover:bg-gray-200 rounded"><Eye size={14} /></button>
                                            <button className="p-1.5 text-gray-400 hover:text-diva-primary hover:bg-gray-200 rounded"><Download size={14} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default DriveModule;
