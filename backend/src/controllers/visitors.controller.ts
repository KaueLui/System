import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { visitorsStore, saveDataToDatabase } from '../data-store';
import { Visitor } from '../entities/Visitor';

export const createVisitor = async (req: Request, res: Response) => {
    try {
        const { nome, cpf, dataNascimento, email, tipoIngresso, dadosCartaoCredito } = req.body;

        if (!nome || !cpf || !dataNascimento || !email || !tipoIngresso) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        const existingVisitorByCpf = visitorsStore.toArray().find(v => v.cpf === cpf);
        if (existingVisitorByCpf) {
            return res.status(409).json({ message: 'CPF já cadastrado.' });
        }
        const existingVisitorByEmail = visitorsStore.toArray().find(v => v.email === email);
        if (existingVisitorByEmail) {
            return res.status(409).json({ message: 'E-mail já cadastrado.' });
        }

        const newVisitor = new Visitor(
            uuidv4(),
            nome,
            cpf,
            new Date(dataNascimento), 
            email,
            tipoIngresso,
            dadosCartaoCredito 
        );

        visitorsStore.append(newVisitor);
        await saveDataToDatabase();
        res.status(201).json(newVisitor);
    } catch (error) {
        console.error('Erro ao cadastrar visitante:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao cadastrar visitante', error });
    }
};

export const getVisitors = async (req: Request, res: Response) => {
    try {
        const visitors = visitorsStore.toArray();
        res.status(200).json(visitors);
    } catch (error) {
        console.error('Erro ao buscar visitantes:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar visitantes', error });
    }
};

export const getVisitorById = async (req: Request, res: Response) => {
    try {
        const visitor = visitorsStore.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ message: 'Visitante não encontrado.' });
        }
        res.status(200).json(visitor);
    } catch (error) {
        console.error('Erro ao buscar visitante por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar visitante', error });
    }
};

export const updateVisitor = async (req: Request, res: Response) => {
    try {
        const updatedVisitor = visitorsStore.updateById(req.params.id, req.body);
        if (!updatedVisitor) {
            return res.status(404).json({ message: 'Visitante não encontrado para atualização.' });
        }
        await saveDataToDatabase();
        res.status(200).json(updatedVisitor);
    } catch (error) {
        console.error('Erro ao atualizar visitante:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar visitante', error });
    }
};

export const deleteVisitor = async (req: Request, res: Response) => {
    try {
        const deletedVisitor = visitorsStore.removeById(req.params.id);
        if (!deletedVisitor) {
            return res.status(404).json({ message: 'Visitante não encontrado para exclusão.' });
        }
        await saveDataToDatabase();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir visitante:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir visitante', error });
    }
};