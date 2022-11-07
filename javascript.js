
// -----------------------------------------------------------------
//  Retrieve the seven best films (for all genre or a specific one)
// -----------------------------------------------------------------

function fetch_best_seven_films(genre, best_films)
{
    // Promise-based function
    return new Promise(async function(resolve, reject)
    {
        // Compute first page URL, depending on the genre (empty parameter = all films)
        fetch_URL = 'http://localhost:8000/api/v1/titles/?';
        if (genre.length > 0)
        {
            fetch_URL += 'genre=';
            fetch_URL += genre;
            fetch_URL += '&';
        }
        fetch_URL += 'sort_by=-imdb_score';

        // Loop and retrieve data until 7 films are found
        while (best_films.length < 7)
        {
            // Fetch data (1 page = 5 films)
            response = await fetch(fetch_URL,
            {
                method: 'GET',
                headers:
                {
                    'Content-Type': 'application/json',
                }
            });

            // Filter errors
            if (!response.ok)
            {
                reject('Could not load API data');
            }

            // Translate into an object and prepare next page if necessary
            data = await response.json();
            fetch_URL = data.next;

            // Store films
            for (let i = 0; i < data.results.length; i++)
            {
                // Extract interesting infos
                let film_general_infos =
                    {
                        title: data.results[i].title,
                        id: data.results[i].id,
                        image_url: data.results[i].image_url,
                    }

                // Store until seven elements have been found
                best_films.push(film_general_infos);
                if (best_films.length === 7)
                {
                    break;
                }
            }
        }

        // Film list is ready
        resolve(best_films);
    })
}


// ---------------------------------------------
//  Functions to update pictures on the webpage
// ---------------------------------------------

function update_best_films(film_list, id_prefix, first_index)
{
    if ((first_index >= 0) && (first_index < 4))
    {
        for (let i = 0 ; i < 4 ; i++)
        {
            document.getElementById(id_prefix + i).src = film_list[first_index + i].image_url;
        }
    }
}


function arrow_buttons_click(e)
{
    // Retrieve id from clicked element
    switch(e.target.id)
    {
    case "left_button_0": if (all_films_first_index > 0)
                        {
                            all_films_first_index--;
                            update_best_films(best_all_films, "all_", all_films_first_index);
                        }
                        break;

    case "left_button_1": if (action_films_first_index > 0)
                        {
                            action_films_first_index--;
                            update_best_films(best_action_films, "action_", action_films_first_index);
                        }
                        break;

    case "left_button_2": if (comedy_films_first_index > 0)
                        {
                            comedy_films_first_index--;
                            update_best_films(best_comedy_films, "comedy_", comedy_films_first_index);
                        }
                        break;

    case "left_button_3": if (horror_films_first_index > 0)
                        {
                            horror_films_first_index--;
                            update_best_films(best_horror_films, "horror_", horror_films_first_index);
                        }
                        break;

    case "right_button_0": if (all_films_first_index < 3)
                        {
                            all_films_first_index++;
                            update_best_films(best_all_films, "all_", all_films_first_index);
                        }
                        break;

    case "right_button_1": if (action_films_first_index < 3)
                        {
                            action_films_first_index++;
                            update_best_films(best_action_films, "action_", action_films_first_index);
                        }
                        break;

    case "right_button_2": if (comedy_films_first_index < 3)
                        {
                            comedy_films_first_index++;
                            update_best_films(best_comedy_films, "comedy_", comedy_films_first_index);
                        }
                        break;

    case "right_button_3": if (horror_films_first_index < 3)
                        {
                            horror_films_first_index++;
                            update_best_films(best_horror_films, "horror_", horror_films_first_index);
                        }
                        break;

    default: break;
    }
}


// ---------------------------------------------------------------------
//  Functions to retrieve and render detailed informations about a film
// ---------------------------------------------------------------------

function get_film_infos(film_id)
{
    // Promise-based function
    return new Promise(async function(resolve, reject)
    {
        // Compute URL
        fetch_URL = 'http://localhost:8000/api/v1/titles/' + film_id;

        // Fetch data
        response = await fetch(fetch_URL,
        {
            method: 'GET',
            headers:
            {
                'Content-Type': 'application/json',
            }
        });

        // Filter errors
        if (!response.ok)
        {
            reject('Could not load API data');
        }

        // Translate into an object and prepare next page if necessary
        data = await response.json();

        // Extract interesting infos
        let film_general_infos =
        {
            title: data.title,
            release_date: data.date_published,
            image_url: data.image_url,
            rating: data.avg_vote,
            imdb_score: data.imdb_score,
            description: data.description,
            long_description: data.long_description,
            duration: data.duration,
            worldwide_income: data.worldwide_gross_income,
            actors: data.actors.join(", "),
            directors: data.directors.join(", "),
            genres: data.genres.join(", "),
            countries: data.countries.join(", ")
        }

    // Film list is ready
    resolve(film_general_infos);

    })
}


function print_film_infos(id)
{
    // Get infos thanks to the id
    get_film_infos(id).then(function(response)
        {
            // Fill and display modal window
            document.getElementById('modal_film_title').innerHTML = "<em class=\"modal_em\">Title:</em> " + response.title;
            document.getElementById('modal_film_date').innerHTML = "<em>Release date:</em> " + response.release_date;
            document.getElementById('modal_film_rating').innerHTML = "<em>Avg. votes:</em> " + response.rating;
            document.getElementById('modal_film_imdb').innerHTML = "<em>Imdb score:</em> " + response.imdb_score;
            document.getElementById('modal_film_description').innerHTML = "<em>Description:</em> " + response.long_description;
            document.getElementById('modal_film_duration').innerHTML = "<em>Duration:</em> " + response.duration + "min";
            document.getElementById('modal_film_income').innerHTML = "<em>Worldwide gross income:</em> " + response.worldwide_gross_income;
            document.getElementById('modal_film_actors').innerHTML = "<em>Actors:</em> " + response.actors;
            document.getElementById('modal_film_directors').innerHTML = "<em>Directors:</em> " + response.directors;
            document.getElementById('modal_film_genres').innerHTML = "<em>Genres:</em> " + response.genres;
            document.getElementById('modal_film_countries').innerHTML = "<em>Countries:</em> " + response.countries;
            document.getElementById('modal_img').src = response.image_url;
            modal.style.display = "flex";
        },
        function(error)
        {
            alert('Error while retrieving detailed film infos from API');
        });
}


function film_infos_click(e)
{
    // Retrieve id from clicked element
    switch(e.target.id)
    {
    case "play_button": print_film_infos(best_all_films[0].id);
                        break;
    case "all_0":       print_film_infos(best_all_films[all_films_first_index].id);
                        break;
    case "all_1":       print_film_infos(best_all_films[all_films_first_index + 1].id);
                        break;
    case "all_2":       print_film_infos(best_all_films[all_films_first_index + 2].id);
                        break;
    case "all_3":       print_film_infos(best_all_films[all_films_first_index + 3].id);
                        break;
    case "action_0":    print_film_infos(best_action_films[action_films_first_index].id);
                        break;
    case "action_1":    print_film_infos(best_action_films[action_films_first_index + 1].id);
                        break;
    case "action_2":    print_film_infos(best_action_films[action_films_first_index + 2].id);
                        break;
    case "action_3":    print_film_infos(best_action_films[action_films_first_index + 3].id);
                        break;
    case "comedy_0":    print_film_infos(best_comedy_films[comedy_films_first_index].id);
                        break;
    case "comedy_1":    print_film_infos(best_comedy_films[comedy_films_first_index + 1].id);
                        break;
    case "comedy_2":    print_film_infos(best_comedy_films[comedy_films_first_index + 2].id);
                        break;
    case "comedy_3":    print_film_infos(best_comedy_films[comedy_films_first_index + 3].id);
                        break;
    case "horror_0":    print_film_infos(best_horror_films[horror_films_first_index].id);
                        break;
    case "horror_1":    print_film_infos(best_horror_films[horror_films_first_index + 1].id);
                        break;
    case "horror_2":    print_film_infos(best_horror_films[horror_films_first_index + 2].id);
                        break;
    case "horror_3":    print_film_infos(best_horror_films[horror_films_first_index + 3].id);
                        break;
    default: break;
    }
}


// When the user clicks on <span> (x), close the modal
function span_onclick(e)
{
    modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
function window_onclick(e)
{
    if (event.target == modal)
    {
        modal.style.display = "none";
    }
}


// -----------------------------------------------------
//  Code starts here - use promises while fetching data
// -----------------------------------------------------

// Init film lists as global variables
var best_all_films = [];
var best_action_films = [];
var best_comedy_films = [];
var best_horror_films = [];
var all_films_first_index = 0;
var action_films_first_index = 0;
var comedy_films_first_index = 0;
var horror_films_first_index = 0;

// Get the modal window and the <span> that will close it
var modal = document.getElementById("modal_window");
var span = document.getElementById("modal_close");

// Attach callbacks to them
modal.addEventListener("click", window_onclick, false);
span.addEventListener("click", span_onclick, false);


// First category = all categories
fetch_best_seven_films('', best_all_films).then(function(response)
{
    update_best_films(best_all_films, "all_", all_films_first_index);

    // Render the best film data
    document.getElementById('film_title').innerHTML = best_all_films[0].title;
    document.getElementById("main_img").src = best_all_films[0].image_url;

    // Short description must be retrieved from a more accurate research
    get_film_infos(best_all_films[0].id).then(function(response)
        {
            document.getElementById('film_synopsis').innerHTML = response.description;
        },
        function(error)
        {
            alert('Error while retrieving synopsis for the best film');
        });
},
function(error)
{
    alert('Error while retrieving all films from API');
});

// Action category
fetch_best_seven_films('Action', best_action_films).then(function(response)
{
    update_best_films(best_action_films, "action_", action_films_first_index);
},
function(error)
{
    alert('Error while retrieving action films from API');
});

// Comedy category
fetch_best_seven_films('Comedy', best_comedy_films).then(function(response)
{
    update_best_films(best_comedy_films, "comedy_", comedy_films_first_index);
},
function(error)
{
    alert('Error while retrieving comedy films from API');
});

// Action category
fetch_best_seven_films('Horror', best_horror_films).then(function(response)
{
    update_best_films(best_horror_films, "horror_", horror_films_first_index);
},
function(error)
{
    alert('Error while retrieving horror films from API');
});

// Add callback for the play button
el = document.getElementById("play_button");
el.addEventListener("click", film_infos_click, false);


// Add callback functions for all the arrow buttons
for (let i = 0 ; i < 4 ; i++)
{
    el = document.getElementById("left_button_" + i);
    el.addEventListener("click", arrow_buttons_click, false);
}

for (let i = 0 ; i < 4 ; i++)
{
    el = document.getElementById("right_button_" + i);
    el.addEventListener("click", arrow_buttons_click, false);
}


// And for the pictures
for (let i = 0 ; i < 4 ; i++)
{
    el = document.getElementById("all_" + i);
    el.addEventListener("click", film_infos_click, false);
    el = document.getElementById("action_" + i);
    el.addEventListener("click", film_infos_click, false);
    el = document.getElementById("comedy_" + i);
    el.addEventListener("click", film_infos_click, false);
    el = document.getElementById("horror_" + i);
    el.addEventListener("click", film_infos_click, false);
}
