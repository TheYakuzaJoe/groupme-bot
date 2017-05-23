#!/usr/bin/env node

//variables
var groupme = require("groupme");
var api = groupme.Stateless;

//private info needed for bot
const TOKEN = process.env.TOKEN;
const USERID = process.env.USERID;
const GROUPID = process.env.GROUPID;

//nonprivate info like bot name, avatar, callback url, etc.
const BOTNAME = "TestBot";

//list user id
api.Users.me(TOKEN, function(e, r) {
	if (!e) {
		console.log(r.name+" "+r.id);
	} else {
		console.log("There was an error collecting user info");
	}
});

//list groups that user is in
api.Groups.index(TOKEN, function(e, r) {
	if (!e) {
		r.forEach(function(group) {
			console.log(group.name+": "+group.id);
		});
	} else {
		console.log("There was an error collecting group info");
	}
});

//find if bot already exists:
//	if so, use it
//	if not, create then use

var found = false;
const BOTID = null;

api.Bots.index(TOKEN, function(e, r) {
	if (!e) {
		r.forEach(function(bot) {
			if (bot.name == BOTNAME) {
				found = true;
				BOTID = bot.id;
				console.log("Found bot with name "+BOTNAME+", will use...");
			}
		});
	} else {
		console.log("There was an error collecting bot info...");
	}
});

if (!found) {
	console.log("Could not find bot with name "+BOTNAME+", creating bot...");
	api.Bots.create(TOKEN, BOTNAME, GROUPID, {}, function(e, r) {
		if (!e) {
			console.log("Bot created successfully...");
		} else {
			console.log("There was an error creating the bot...");
			console.log(e.statusCode+" - "+e.statusMessage);
		}
	});
	
	api.Bots.index(TOKEN, function(e, r) {
		if (!e) {
			r.forEach(function(bot) {
				if (bot.name == BOTNAME) {
					BOTID = bot.id;
					console.log("Got bot id "+BOTID+"...");
				}
			});
		} else {
			console.log("There was an error collecting bot info after bot creation...");
		}
	});
}