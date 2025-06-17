"use client";

import React, { useState } from 'react';
import { Attraction } from '@/types'; 

interface AttractionFormData extends Omit<Attraction, 'id'> {}

interface AttractionFormProps {
    onSubmit: (data: AttractionFormData) => void;
    initialData?: Partial<AttractionFormData>; 
}

const AttractionForm: React.FC<AttractionFormProps> = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState<AttractionFormData>({
        nome: initialData?.nome || '',
        tipo: initialData?.tipo || '',
        capacidadePorHorario: initialData?.capacidadePorHorario || 0,
        horariosDisponiveis: initialData?.horariosDisponiveis || [],
        faixaEtariaMinima: initialData?.faixaEtariaMinima || 0,
        possuiPrioridade: initialData?.possuiPrioridade || false,
        tiposPassePrioritarios: initialData?.tiposPassePrioritarios || [],
    });
    const [newScheduleTime, setNewScheduleTime] = useState<string>('');
    const [newPriorityType, setNewPriorityType] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded-lg shadow-md bg-white max-w-lg mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">Formulário de Atração</h3>

            <label className="block">
                <span className="text-gray-700">Nome:</span>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
            </label>

            <label className="block">
                <span className="text-gray-700">Tipo:</span>
                <input type="text" name="tipo" value={formData.tipo} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
            </label>

            <label className="block">
                <span className="text-gray-700">Capacidade por Horário:</span>
                <input type="number" name="capacidadePorHorario" value={formData.capacidadePorHorario} onChange={handleChange} required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
            </label>

            <label className="block">
                <span className="text-gray-700">Faixa Etária Mínima:</span>
                <input type="number" name="faixaEtariaMinima" value={formData.faixaEtariaMinima} onChange={handleChange} required min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
            </label>

            <div className="border border-gray-200 p-3 rounded-md">
                <span className="block text-gray-700 mb-2">Horários Disponíveis:</span>
                <div className="flex gap-2 mb-2">
                    <input
                        type="time"
                        value={newScheduleTime}
                        onChange={(e) => setNewScheduleTime(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm p-2"
                    />
                    <button type="button" onClick={handleAddScheduleTime} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                        Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.horariosDisponiveis.map(time => (
                        <span key={time} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {time}
                            <button type="button" onClick={() => handleRemoveScheduleTime(time)} className="ml-1 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Prioridade para Passes */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="possuiPrioridade"
                    checked={formData.possuiPrioridade}
                    onChange={handleChange}
                    className="rounded text-blue-600 shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-gray-700">Possui Prioridade para Passes Especiais?</span>
            </label>

            {formData.possuiPrioridade && (
                <div className="border border-gray-200 p-3 rounded-md">
                    <span className="block text-gray-700 mb-2">Tipos de Passe Prioritários:</span>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newPriorityType}
                            onChange={(e) => setNewPriorityType(e.target.value)}
                            placeholder="Ex: VIP, Passe Anual"
                            className="rounded-md border-gray-300 shadow-sm p-2 flex-grow"
                        />
                        <button type="button" onClick={handleAddPriorityType} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                            Adicionar
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(formData.tiposPassePrioritarios || []).map(type => (
                            <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                {type}
                                <button type="button" onClick={() => handleRemovePriorityType(type)} className="ml-1 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Salvar Atração
            </button>
        </form>
    );
};

export default AttractionForm;