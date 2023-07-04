const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const User = require('../models/User');

function matchRoute(io) {
    router.get('/create', async (req, res) => {
        try {
            const user = await User.findById(req.userId);

            const match = new Match({
                owner: user._id
            });

            await match.save();

            const matchId = match._id;
            const matchStatus = match.status;

            user.matches.push(matchId);
            await user.save();

            return res.status(200).json({
                message: 'Match created!',
                matchId: matchId,
                matchStatus: matchStatus
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/join/:matchId', async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            const match = await Match.findById(req.params.matchId);

            if (match.status !== 'waiting' || match.challenger !== 'paused') {
                return res.status(400).json({
                    message: 'Match is not waiting for players'
                });
            }
            else if (match.status === 'waiting') {
                if(!match.owner.equals(user._id)) {
                    match.challenger = user._id;
                    match.status = 'playing';
                    
                    await match.save();
                    
                    return res.status(200).json({
                        message: 'Match joined!',
                        matchId: match._id,
                        matchStatus: match.status
                    })
                } else {
                    return res.status(200).json({
                        message: 'Match joined!',
                        matchId: match._id,
                        matchStatus: match.status
                    })
                }
            } else {
                if(match.owner.equals(user._id) || match.challenger.equals(user._id)) {
                    match.status = 'playing';
                    
                    await match.save();
                    
                    return res.status(200).json({
                        message: 'Match resumed!',
                        matchId: match._id,
                        matchStatus: match.status
                    })
                } else {
                    return res.status(400).json({
                        message: 'Match is not waiting for players'
                    });
                }
            }
        }  catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

module.exports = matchRoute;