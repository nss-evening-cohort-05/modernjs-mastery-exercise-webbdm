$(document).ready(function() {

    let charArray;
    let gendersArray;
    let teamsArray;

    $('.btn').click(function(event) {
        //console.log($(event.currentTarget).attr("id"));
        let clickedBtn = $(event.currentTarget);
        $(".big-logo").hide();
        dataGetter(clickedBtn);
    });

    const loadCharacters = () => {
        return new Promise(function(resolve, reject) {
            $.ajax("./db/characters.json")
                .done(function(data1) {
                    resolve(data1.characters);
                })
                .fail(function(error) {
                    reject(error);
                });
        });
    };

    const loadGenders = () => {
        return new Promise(function(resolve, reject) {
            $.ajax("./db/genders.json")
                .done(function(data1) {
                    resolve(data1.genders);
                })
                .fail(function(error) {
                    reject(error);
                });
        });
    };

    const loadTeams = () => {
        return new Promise(function(resolve, reject) {
            $.ajax("./db/teams.json")
                .done(function(data1) {
                    resolve(data1.teams);
                })
                .fail(function(error) {
                    reject(error);
                });
        });
    };

    const sorter = (clickedBtn) => {
        let charToPrint = [];
        teamsArray.forEach(function(currentTeam) {
            let btnID = clickedBtn.attr("id");
            if (btnID == currentTeam.id) {
                //console.log("yay", btnID, currentTeam.name);
                charArray.forEach(function(currentChar) {
                    if (btnID == currentChar.team_id) {
                        charToPrint.push(currentChar);
                    }
                })
            }
        });
        //console.log(charToPrint);
        return charToPrint;
    };

    const writeDOM = (charArray) => {
    	//console.log(charArray, "test");

    	let charString = "";

    	charArray.forEach(function(hero){
    		console.log(hero.name);
    	})
    };


    const dataGetter = (clickedBtn) => {

        Promise.all([loadTeams(), loadGenders(), loadCharacters()])
            .then((result) => {

                charArray = result[2];
                gendersArray = result[1];
                teamsArray = result[0];

                writeDOM(sorter(clickedBtn));
            })
            .catch(function(error) {
                console.log(error);
            });

    };




















    // End 
});
