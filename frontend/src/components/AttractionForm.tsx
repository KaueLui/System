"use client";

import React, { useState } from 'react';
import { Attraction } from '@/types';

interface AttractionFormData extends Omit<Attraction, 'id'> {}

interface AttractionFormProps {
    onSubmit: (data: AttractionFormData) => void;
    initialData?: Attraction;
    onCancel?: () => void;
}

const AttractionForm: React.FC<AttractionFormProps> = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState<AttractionFormData>({
        nome: initialData?.nome || '',
        tipo: initialData?.tipo || '',
        capacidadePorHorario: initialData?.capacidadePorHorario || 0,
        horariosDisponiveis: initialData?.horariosDisponiveis || [],
        faixaEtariaMinima: initialData?.faixaEtariaMinima || 0,
        possuiPrioridade: initialData?.possuiPrioridade || false,
        tiposPassePrioritarios: initialData?.tiposPassePrioritarios || []
    });

    const [newScheduleTime, setNewScheduleTime] = useState('');
    const [newPriorityType, setNewPriorityType] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'capacidadePorHorario' || name === 'faixaEtariaMinima') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddScheduleTime = () => {
        if (newScheduleTime && !formData.horariosDisponiveis.includes(newScheduleTime)) {
            setFormData(prev => ({
                ...prev,
                horariosDisponiveis: [...prev.horariosDisponiveis, newScheduleTime].sort()
            }));
            setNewScheduleTime('');
        }
    };

    const handleRemoveScheduleTime = (timeToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            horariosDisponiveis: prev.horariosDisponiveis.filter(time => time !== timeToRemove)
        }));
    };

    const handleAddPriorityType = () => {
        if (newPriorityType && !formData.tiposPassePrioritarios?.includes(newPriorityType)) {
            setFormData(prev => ({
                ...prev,
                tiposPassePrioritarios: [...(prev.tiposPassePrioritarios || []), newPriorityType]
            }));
            setNewPriorityType('');
        }
    };

    const handleRemovePriorityType = (typeToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tiposPassePrioritarios: prev.tiposPassePrioritarios?.filter(type => type !== typeToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const attractionTypes = [
        { value: 'montanha-russa', label: '🎢 Montanha-Russa' },
        { value: 'roda-gigante', label: '🎡 Roda-Gigante' },
        { value: 'carrossel', label: '🎠 Carrossel' },
        { value: 'casa-assombrada', label: '👻 Casa Assombrada' },
        { value: 'aquático', label: '🌊 Atração Aquática' },
        { value: 'infantil', label: '🧸 Infantil' },
        { value: 'radical', label: '⚡ Radical' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-blue-500">🎪</span>
                    Nome da Atração
                </label>
                <input 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    required 
                    placeholder="Digite o nome da atração"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow shadow-sm"
                />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-purple-500">🎭</span>
                    Tipo da Atração
                </label>
                <div className="relative">
                    <select 
                        name="tipo" 
                        value={formData.tipo} 
                        onChange={handleChange} 
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow shadow-sm bg-white"
                    >
                        <option value="" disabled>Selecione um tipo</option>
                        {attractionTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Capacidade por Horário */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                        <span className="text-green-500">👥</span>
                        Capacidade por Horário
                    </label>
                    <input 
                        type="number" 
                        name="capacidadePorHorario" 
                        value={formData.capacidadePorHorario} 
                        onChange={handleChange} 
                        required 
                        min="1"
                        placeholder="Ex: 50"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                    <p className="text-sm text-gray-500">Quantas pessoas podem usar a atração por horário</p>
                </div>

                {/* Faixa Etária Mínima */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                        <span className="text-orange-500">👶</span>
                        Idade Mínima
                    </label>
                    <input 
                        type="number" 
                        name="faixaEtariaMinima" 
                        value={formData.faixaEtariaMinima} 
                        onChange={handleChange} 
                        required 
                        min="0"
                        placeholder="Ex: 12"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                    <p className="text-sm text-gray-500">Idade mínima em anos para usar a atração</p>
                </div>
            </div>

            {/* Horários Disponíveis */}
            <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-indigo-500">🕐</span>
                    Horários Disponíveis
                </label>
                <div className="flex items-center gap-2">
                    <input 
                        type="time" 
                        value={newScheduleTime} 
                        onChange={(e) => setNewScheduleTime(e.target.value)} 
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow shadow-sm"
                    />
                    <button 
                        type="button" 
                        onClick={handleAddScheduleTime}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
                    >
                        Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {formData.horariosDisponiveis.map(time => (
                        <div key={time} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            <span>{time}</span>
                            <button type="button" onClick={() => handleRemoveScheduleTime(time)} className="text-blue-600 hover:text-blue-800 font-bold">×</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prioridade */}
            <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        name="possuiPrioridade" 
                        checked={formData.possuiPrioridade} 
                        onChange={handleChange} 
                        id="possuiPrioridade"
                        className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <label htmlFor="possuiPrioridade" className="ml-3 text-gray-700 font-medium cursor-pointer">
                        Possui Fila de Prioridade (VIP)
                    </label>
                </div>

                {formData.possuiPrioridade && (
                    <div className="space-y-2 pt-3 border-t border-gray-200 mt-3">
                        <label className="flex items-center gap-2 text-gray-700 font-medium">
                            <span className="text-yellow-500">⭐</span>
                            Tipos de Passe Prioritários
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={newPriorityType} 
                                onChange={(e) => setNewPriorityType(e.target.value)} 
                                placeholder="Ex: VIP, FastPass"
                                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow shadow-sm"
                            />
                            <button 
                                type="button" 
                                onClick={handleAddPriorityType}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md"
                            >
                                Adicionar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tiposPassePrioritarios?.map(type => (
                                <div key={type} className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                    <span>{type}</span>
                                    <button type="button" onClick={() => handleRemovePriorityType(type)} className="text-yellow-600 hover:text-yellow-800 font-bold">×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                {onCancel && (
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                )}
                <button 
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                    {initialData ? 'Salvar Alterações' : 'Cadastrar Atração'}
                </button>
            </div>
        </form>
    );
};

export default AttractionForm;