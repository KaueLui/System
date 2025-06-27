"use client";

import React, { useState } from 'react';
import { Visitor } from '@/types';

interface VisitorFormData extends Omit<Visitor, 'id'> {}

interface VisitorFormProps {
    onSubmit: (data: VisitorFormData) => void;
    initialData?: Visitor;
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

    const getTicketDescription = (tipo: string) => {
        const descriptions: { [key: string]: string } = {
            'normal': 'Acesso a todas as atrações básicas',
            'VIP': 'Prioridade nas filas + acesso VIP',
            'passe-anual': 'Acesso ilimitado por 1 ano'
        };
        return descriptions[tipo] || '';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-blue-500">👤</span>
                    Nome Completo
                </label>
                <input 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    required 
                    placeholder="Digite seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
            </div>

            {/* CPF */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-green-500">📄</span>
                    CPF
                </label>
                <input 
                    type="text" 
                    name="cpf" 
                    value={formData.cpf} 
                    onChange={handleChange} 
                    required 
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-purple-500">🎂</span>
                    Data de Nascimento
                </label>
                <input 
                    type="date" 
                    name="dataNascimento" 
                    value={formData.dataNascimento} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
            </div>

            {/* E-mail */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-orange-500">📧</span>
                    E-mail
                </label>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
            </div>

            {/* Tipo de Ingresso */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-pink-500">🎫</span>
                    Tipo de Ingresso
                </label>
                <div className="relative">
                    <select 
                        name="tipoIngresso" 
                        value={formData.tipoIngresso} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                    >
                        <option value="normal">🎫 Normal</option>
                        <option value="VIP">⭐ VIP</option>
                        <option value="passe-anual">🎟️ Passe Anual</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    💡 {getTicketDescription(formData.tipoIngresso)}
                </p>
            </div>

            {/* Botão de Submit */}
            <div className="pt-4">
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                    <span className="flex items-center justify-center gap-3">
                        <span className="text-xl">🎉</span>
                        Cadastrar Visitante
                    </span>
                </button>
            </div>
        </form>
    );
};

export default VisitorForm;