import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; 
import { attractionsStore, saveDataToDatabase } from '../data-store'; 
import { Attraction } from '../entities/Attraction';

export const createAttraction = async (req: Request, res: Response) => {
    try {
        const { nome, tipo, capacidadePorHorario, horariosDisponiveis, faixaEtariaMinima, possuiPrioridade, tiposPassePrioritarios } = req.body;

        if (!nome || !tipo || !capacidadePorHorario || !horariosDisponiveis || !faixaEtariaMinima) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }
        if (!Array.isArray(horariosDisponiveis)) {
            return res.status(400).json({ message: 'horariosDisponiveis deve ser um array de strings.' });
        }
        if (possuiPrioridade && !Array.isArray(tiposPassePrioritarios)) {
            return res.status(400).json({ message: 'tiposPassePrioritarios deve ser um array de strings se possuiPrioridade for verdadeiro.' });
        }

        const newAttraction = new Attraction(
            uuidv4(), 
            nome,
            tipo,
            capacidadePorHorario,
            horariosDisponiveis,
            faixaEtariaMinima,
            possuiPrioridade,
            tiposPassePrioritarios
        );

        attractionsStore.append(newAttraction); 
        await saveDataToDatabase(); 

        res.status(201).json(newAttraction); 
    } catch (error) {
        console.error('Erro ao criar atração:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar atração', error });
    }
};

export const getAttractions = async (req: Request, res: Response) => {
    try {
        const attractions = attractionsStore.toArray(); 
        res.status(200).json(attractions);
    } catch (error) {
        console.error('Erro ao buscar atrações:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar atrações', error });
    }
};

export const getAttractionById = async (req: Request, res: Response) => {
    try {
        const attraction = attractionsStore.findById(req.params.id); 
        if (!attraction) {
            return res.status(404).json({ message: 'Atração não encontrada' });
        }
        res.status(200).json(attraction);
    } catch (error) {
        console.error('Erro ao buscar atração por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar atração', error });
    }
};

export const updateAttraction = async (req: Request, res: Response) => {
    try {
        const updatedAttraction = attractionsStore.updateById(req.params.id, req.body); 
        if (!updatedAttraction) {
            return res.status(404).json({ message: 'Atração não encontrada para atualização' });
        }
        await saveDataToDatabase(); 
        res.status(200).json(updatedAttraction);
    } catch (error) {
        console.error('Erro ao atualizar atração:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar atração', error });
    }
};

export const deleteAttraction = async (req: Request, res: Response) => {
    try {
        const deletedAttraction = attractionsStore.removeById(req.params.id); 
        if (!deletedAttraction) {
            return res.status(404).json({ message: 'Atração não encontrada para exclusão' });
        }
        await saveDataToDatabase(); 
        res.status(204).send(); 
    } catch (error) {
        console.error('Erro ao excluir atração:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir atração', error });
    }
};