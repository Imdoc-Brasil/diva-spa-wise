import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { SettingsSection, SettingsCard } from '../../shared';
import { formatCurrency } from '../../utils/formatters';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    category: 'service' | 'product' | 'professional_use' | 'medical_material';
    stock?: number;
    minStockLevel?: number;
    presentation?: string;
    contentQuantity?: number;
    contentUnit?: string;
    activeIngredients?: string;
}

interface ProductSettingsProps {
    products: Product[];
    onAddProduct: () => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct?: (productId: string) => void;
    category: 'service' | 'professional_use' | 'medical_material';
}

/**
 * Product Settings Component
 * Manages products, services, and inventory
 */
export const ProductSettings: React.FC<ProductSettingsProps> = ({
    products,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
    category
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter products by category
    const filteredProducts = products.filter(p => {
        if (category === 'service') {
            return p.category === 'service';
        }
        return p.category === category;
    });

    // Apply search filter
    const displayProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryTitle = () => {
        switch (category) {
            case 'service':
                return 'Serviços & Tratamentos';
            case 'professional_use':
                return 'Produtos de Uso Profissional';
            case 'medical_material':
                return 'Materiais Médicos & Estoque';
            default:
                return 'Produtos';
        }
    };

    const getCategoryDescription = () => {
        switch (category) {
            case 'service':
                return 'Gerencie o menu de serviços e tratamentos oferecidos.';
            case 'professional_use':
                return 'Produtos de uso profissional (toxinas, preenchedores, etc).';
            case 'medical_material':
                return 'Materiais médicos e gestão de estoque.';
            default:
                return 'Gerencie seus produtos.';
        }
    };

    const showStock = category !== 'service';

    return (
        <SettingsSection
            title={getCategoryTitle()}
            description={getCategoryDescription()}
            icon={<Package size={20} />}
        >
            <div className="space-y-4">
                {/* Header with Search and Add Button */}
                <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-600"
                        />
                    </div>
                    <button
                        onClick={onAddProduct}
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center hover:bg-purple-700 shadow-sm"
                    >
                        <Plus size={16} className="mr-2" />
                        {category === 'service' ? 'Novo Serviço' : 'Novo Produto'}
                    </button>
                </div>

                {/* Products Table */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-200">
                                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">
                                        {category === 'service' ? 'Serviço' : 'Produto'}
                                    </th>
                                    {category === 'professional_use' && (
                                        <th className="px-6 py-4">Princípios Ativos</th>
                                    )}
                                    {showStock && (
                                        <th className="px-6 py-4">Estoque</th>
                                    )}
                                    <th className="px-6 py-4 text-right">
                                        {category === 'service' ? 'Preço' : 'Custo Médio'}
                                    </th>
                                    <th className="px-6 py-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {displayProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-white transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{product.name}</p>
                                            {product.description && (
                                                <p className="text-xs text-gray-500 mt-0.5">{product.description}</p>
                                            )}
                                            {product.presentation && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                        {product.presentation}
                                                    </span>
                                                    {product.contentQuantity && (
                                                        <span>
                                                            Contém {product.contentQuantity} {product.contentUnit}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        {category === 'professional_use' && (
                                            <td className="px-6 py-4 text-gray-600">
                                                {product.activeIngredients ? (
                                                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium border border-purple-100">
                                                        {product.activeIngredients}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        )}
                                        {showStock && (
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${!product.stock || product.stock <= (product.minStockLevel || 5)
                                                        ? 'text-red-500'
                                                        : 'text-green-600'
                                                    }`}>
                                                    {product.stock || 0}{' '}
                                                    <span className="text-xs font-normal text-gray-400">
                                                        {product.contentUnit || 'un'}
                                                    </span>
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-right font-mono text-gray-600">
                                            {formatCurrency(
                                                category === 'service' ? product.price : (product.costPrice || 0)
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEditProduct(product)}
                                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {onDeleteProduct && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Deseja excluir "${product.name}"?`)) {
                                                                onDeleteProduct(product.id);
                                                            }
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {displayProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={showStock ? 4 : 3} className="text-center py-12 text-gray-400 italic">
                                            <div className="flex flex-col items-center gap-2">
                                                <Package size={32} className="opacity-20" />
                                                <p>
                                                    {searchTerm
                                                        ? 'Nenhum resultado encontrado.'
                                                        : `Nenhum ${category === 'service' ? 'serviço' : 'produto'} cadastrado.`
                                                    }
                                                </p>
                                                {!searchTerm && (
                                                    <button
                                                        onClick={onAddProduct}
                                                        className="text-purple-600 font-bold underline text-xs"
                                                    >
                                                        Cadastrar Primeiro {category === 'service' ? 'Serviço' : 'Produto'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                {displayProducts.length > 0 && (
                    <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                        <span>
                            {displayProducts.length} {category === 'service' ? 'serviço(s)' : 'produto(s)'}
                            {searchTerm && ` encontrado(s)`}
                        </span>
                        {showStock && (
                            <span className="text-red-500">
                                {displayProducts.filter(p => !p.stock || p.stock <= (p.minStockLevel || 5)).length} com estoque baixo
                            </span>
                        )}
                    </div>
                )}
            </div>
        </SettingsSection>
    );
};

export default ProductSettings;
