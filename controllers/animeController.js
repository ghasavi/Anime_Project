import Anime from '../models/anime.js';
import { isAdmin } from './userController.js';

export async function getAnimes(req, res){

    try{
        if(isAdmin(req)){
            const animes = await Anime.find()
            res.json(animes);
        }else{
            const animes = await Anime.find({ isAvailable: true });
            res.json(animes);
        }
    }catch(err){
        res.status(500).json({
            message: "Error retrieving animes",
            error: err
        });
    }
     
}
export function saveAnime(req, res){

    if(!isAdmin(req)){
        res.status(403).json({
            message: "Only admins can add new animes"
        });
        return;
    }


 
    const anime = new Anime(
        req.body
    );

    anime.save().then(() => {
        res.json(
            {   
                message: "Anime added successfully"
            }
        )
    }).catch((err) => {
        res.json(
            {
                message: "Error adding anime",
                error: err
            }
        )
    })
}

export async function deleteAnime(req, res){

    if(!isAdmin(req)){
        res.status(403).json({
            message: "Only admins can delete animes"
        });
        return;
    }
    try{
    await Anime.deleteOne({animeId : req.params.animeId})

    res.json(
        {
            message: "Anime deleted successfully"
        }
            )
        }catch(err){
            res.json(
                {
                    message: "Error deleting anime",
                    error: err
                }
            )
        }
}

export async function updateAnime(req, res){

    if(!isAdmin(req)){
        res.status(403).json({
            message: "Only admins can update animes"
        });
        return;
    }

    const animeId = req.params.animeId;
    const updateData = req.body;

    try{
        await Anime.updateOne(
            { animeId: animeId }, 
            updateData);

            res.json({
                message: "Anime updated successfully"
            });

    }catch(err){
        res.status(500).json({
            message: "Error updating anime",
            error: err
        });
    }
}

export async function getAnimeById(req, res){
    const animeId = req.params.animeId;

    try{
        const anime = await Anime.findOne(
            { animeId: animeId });
        
            if(anime == null){
                res.status(404).json({
                    message: "Anime not found"
                })
                return;
            }
            if(anime.isAvailable){
                res.json(anime);
            }else{
                if(isAdmin(req)){
                    res.status(403).json({
                        message: "Anime is not available"
                    });
                }else{
                    res.json(anime);
                }
            }
    }catch(err){
        res.status(500).json({
            message: "Error retrieving anime",
            error: err
        });
    }   
}