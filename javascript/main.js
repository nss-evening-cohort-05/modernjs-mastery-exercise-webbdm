$(document).ready(function() {

    //Global variables for incoming JSON daata
    let charArray;
    let gendersArray;
    let teamsArray;

    // Db filepaths for JSON
    const charFile = "./db/characters.json";
    const gendersFile = "./db/genders.json";
    const teamsFile = "./db/teams.json";

    $.ajax("./db/teams.json").done((data1) => {
        makeButtons(data1.teams);
    }).fail((error) => {
        console.log(error);
    });

    const makeButtons = (teams) => { // Dynamically create the team buttons from teams.json
        teams.forEach((team, index) => {
            $("#btnDIV").append(`<button type="button" class="btn btn-primary" id="${index}">${team.name}</button>`);
        });

        $('.btn').click((event) => {
            let clickedBtn = $(event.currentTarget);
            $(".big-logo").hide();
            dataGetter(clickedBtn);
        });
    };

    const dataCall = (path) => { // Creates a new Promise with each filepath
        return new Promise((resolve, reject) => {
            $.ajax(path)
                .done((data1) => {
                    resolve(data1);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    };

    const sorter = (clickedBtn) => { // Assembles an array of heroes that correspond to the team button that is clicked
        let charToPrint = [];
        teamsArray.forEach((currentTeam) => {
            let btnID = clickedBtn.attr("id");
            if (btnID == currentTeam.id) {
                charArray.forEach((currentChar) => {
                    if (btnID == currentChar.team_id) {
                        charToPrint.push(currentChar);
                    }
                });
            }
        });
        return charToPrint;
    };

    // Write the returned character/hero array from sorter function to the DOM
    const writeDOM = (charArray) => {
        let teamString = "";
        let teamRow = "";
        let counter = 0;
        teamString += `<div class="row">`;

        charArray.forEach((hero) => { // Adds a .gender key/value pair to every hero 
            gendersArray.forEach((gender) => {
                if (hero.gender_id == gender.id) {
                    hero.gender = gender.type;
                }

                if (hero.gender == "Male" && hero.description === "") { // Adds default bio based on gender if description was blank
                    hero.description = "1234567890";
                } else if (hero.gender == "Female" && hero.description === "") {
                    hero.description = "abcde fghij klmno pqrst uvwxy z";
                }
            });
        });

        charArray.forEach((hero) => {
            let charString = "";
            charString += `<div class="col-md-3">
		    				   <div class="thumbnail ${hero.gender}">
			    				   <h3>${hero.name}</h3>
					    		   <img src=${hero.image} alt="${hero.name}">
				      				   <div class="caption">
					        		     <p>${hero.description}</p>
				      				   </div>
		    				   </div>
    					   </div>`;
            counter += 1;
            teamRow += charString;

            if (counter % 4 === 0) { // Cap the row every 4 heroes 
                teamRow += `</div>`;
                teamString += teamRow;
                teamRow = "";
                teamRow += `<div class="row">`;
            } else if (counter === charArray.length) { // Add the closing tag to a row here if it's the last hero in the array
                teamRow += `</div>`;
                teamString += teamRow;
            }

        });
        $("#team").html(teamString);
    };

    const dataGetter = (clickedBtn) => {
        Promise.all([dataCall(teamsFile), dataCall(gendersFile), dataCall(charFile)])
            .then((result) => {
                charArray = result[2].characters;
                gendersArray = result[1].genders;
                teamsArray = result[0].teams;
                writeDOM(sorter(clickedBtn)); // Calls writeDOM with the team array the sorter function generated
            })
            .catch((error) => {
                console.log(error);
            });
    };
});
