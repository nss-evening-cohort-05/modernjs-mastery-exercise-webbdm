$(document).ready(function() {

    let charArray;
    let gendersArray;
    let teamsArray;

    $.ajax("./db/teams.json").done((data1) => {
            makeButtons(data1.teams);
        }).fail((error) => {
            reject(error);
        });

    const makeButtons = (teams) => {
    	teams.forEach((team,index)=>{
    		console.log(team.name);
    		$("#btnDIV").append(`<button type="button" class="btn btn-primary" id="${index}">${team.name}</button>`);
    	});

        $('.btn').click((event) => {
            let clickedBtn = $(event.currentTarget);
            $(".big-logo").hide();
            dataGetter(clickedBtn);
        });
    };

    const loadCharacters = () => {
        return new Promise((resolve, reject) => {
            $.ajax("./db/characters.json")
                .done((data1) => {
                    resolve(data1.characters);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    };

    const loadGenders = () => {
        return new Promise((resolve, reject) => {
            $.ajax("./db/genders.json")
                .done((data1) => {
                    resolve(data1.genders);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    };

    const loadTeams = () => {
        return new Promise((resolve, reject) => {
            $.ajax("./db/teams.json")
                .done((data1) => {
                    resolve(data1.teams);
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

                if (hero.gender == "Male" && hero.description === "") { // Adds default bio based on gender if descrption was blank
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
        Promise.all([loadTeams(), loadGenders(), loadCharacters()])
            .then((result) => {
                charArray = result[2];
                gendersArray = result[1];
                teamsArray = result[0];
                writeDOM(sorter(clickedBtn)); // Calls writeDOM with the team array the sorter function generated
            })
            .catch((error) => {
                console.log(error);
            });
    };
});
