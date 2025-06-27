"use client";

import React, { useState } from 'react';
import { Attraction } from '@/types';

interface AttractionFormData extends Omit<Attraction, 'id'> {}

interface AttractionFormProps {
    onSubmit: (data: AttractionFormData) => void;
    initialData?: Attraction;
}

const AttractionForm: React.FC<AttractionFormProps> = ({ onSubmit, initialData }) => {
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                    >
                        <option value="">Selecione o tipo</option>
                        {attractionTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Capacidade */}
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

            {/* Faixa Etária */}
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

            {/* Horários Disponíveis */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-indigo-500">🕐</span>
                    Horários Disponíveis
                </label>
                <div className="flex gap-2">
                    <input 
                        type="time" 
                        value={newScheduleTime} 
                        onChange={(e) => setNewScheduleTime(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                    <button 
                        type="button" 
                        onClick={handleAddScheduleTime}
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        ➕ Adicionar
                    </button>
                </div>
                {formData.horariosDisponiveis.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Horários cadastrados:</h4>
                        <div className="flex flex-wrap gap-2">
                            {formData.horariosDisponiveis.map((time, index) => (
                                <span key={index} className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {time}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveScheduleTime(time)} 
                                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Prioridade */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="possuiPrioridade"
                        checked={formData.possuiPrioridade}
                        onChange={handleChange}
                        className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500 focus:ring-2"
                    />
                    <span className="flex items-center gap-2 text-yellow-800 font-medium">
                        <span>⭐</span>
                        Possui Prioridade para Passes Especiais
                    </span>
                </label>
                <p className="text-sm text-yellow-700 mt-2 ml-8">
                    Permite que visitantes VIP tenham prioridade na fila
                </p>
            </div>

            {/* Tipos de Passe Prioritários */}
            {formData.possuiPrioridade && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <h4 className="flex items-center gap-2 text-orange-800 font-medium mb-3">
                        <span>🎫</span>
                        Tipos de Passe com Prioridade
                    </h4>
                    <div className="flex gap-2 mb-3">
                        <div className="relative flex-1">
                            <select
                                value={newPriorityType}
                                onChange={(e) => setNewPriorityType(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white appearance-none"
                            >
                                <option value="">Selecione um tipo de passe</option>
                                <option value="VIP">⭐ VIP</option>
                                <option value="passe-anual">🎟️ Passe Anual</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAddPriorityType}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                        >
                            ➕
                        </button>
                    </div>
                    {(formData.tiposPassePrioritarios || []).length > 0 && (
                        <div>
                            <p className="text-sm text-orange-700 mb-2">Passes com prioridade:</p>
                            <div className="flex flex-wrap gap-2">
                                {(formData.tiposPassePrioritarios || []).map((type, index) => (
                                    <span key={index} className="inline-flex items-center gap-2 bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {type}
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemovePriorityType(type)} 
                                            className="text-orange-600 hover:text-orange-800 hover:bg-orange-300 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Botão de Submit */}
            <div className="pt-4">
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                    <span className="flex items-center justify-center gap-3">
                        <span className="text-xl">🎢</span>
                        Cadastrar Atração
                    </span>
                </button>
            </div>
        </form>
    );
};

export default AttractionForm;