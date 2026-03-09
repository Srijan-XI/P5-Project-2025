function getFact() {
      const factElement = document.getElementById('fact');

      // Fade out first
      factElement.classList.add('hidden');

      fetch('/random-fact')
        .then(response => response.json())
        .then(data => {
          setTimeout(() => {
            factElement.innerText = data.fact;
            factElement.classList.remove('hidden'); // Fade back in
          }, 300); // match with transition timing
        })
        .catch(error => {
          factElement.innerText = "Oops! Could not fetch a fact.";
          factElement.classList.remove('hidden');
        });
    }