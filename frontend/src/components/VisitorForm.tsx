"use client";

import React, { useState } from 'react';
import { Visitor } from '@/types';

interface VisitorFormData extends Omit<Visitor, 'id'> {}

interface VisitorFormProps {
    onSubmit: (data: VisitorFormData) => void;
    initialData?: Partial<VisitorFormData>;
}

const VisitorForm: React.FC<VisitorFormProps> = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState<VisitorFormData>({
        nome: initialData?.nome || '',
        cpf: initialData?.cpf || '',
        dataNascimento: initialData?.dataNascimento || '',
        email: initialData?.email || '',
        tipoIngresso: initialData?.tipoIngresso || 'normal',
        dadosCartaoCredito: initialData?.dadosCartaoCredito,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto my-4 p-4 border rounded-lg shadow-md bg-white">
            <label className="block">
                <span className="text-gray-700">Nome:</span>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2" />
            </label>
            <label className="block">
                <span className="text-gray-700">CPF:</span>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2" />
            </label>
            <label className="block">
                <span className="text-gray-700">Data de Nascimento:</span>
                <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2" />
            </label>
            <label className="block">
                <span className="text-gray-700">E-mail:</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2" />
            </label>
            <label className="block">
                <span className="text-gray-700">Tipo de Ingresso:</span>
                <select name="tipoIngresso" value={formData.tipoIngresso} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2">
                    <option value="normal">Normal</option>
                    <option value="VIP">VIP</option>
                    <option value="passe-anual">Passe Anual</option>
                </select>
            </label>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Cadastrar Visitante</button>
        </form>
    );
};

export default VisitorForm;