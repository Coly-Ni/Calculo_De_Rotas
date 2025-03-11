/* Variáveis globais */
let map, directionsService, directionsRenderer;
let startMarker, endMarker;

/* Inicia o mapa */
window.onload = initMap;

function initMap() 
{
  /* Criação do mapa */
  map = new google.maps.Map
  (document.getElementById("map"), 
    {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    }
  );

  /* Inicia os serviços de rota */
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  /* Inicia os campos com autocomplete */
  setupAutocomplete("origin", "start");
  setupAutocomplete("destination", "end");
}

/* Função autocomplete para os campos de pesquisa */
function setupAutocomplete(inputId, markerType) 
{
  const input = document.getElementById(inputId);
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener
  ("place_changed", () => 
    {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) 
      {
        alert("Localização inválida!");
        return;
      }

      /* Zoom na localização */
      map.setCenter(place.geometry.location);
      map.setZoom(8); 

      /* Adiciona marcador */
      addMarker(place.geometry.location, markerType);

      /* Calcula a rota se existir marcadores */
      if (startMarker && endMarker) 
      {
        calculateRoute();
      }
    }
  );
}

/* Função para adicionar marcador */
function addMarker(position, markerType) 
{
  /* Remove o marcador caso exista */
  if (markerType === "start" && startMarker) startMarker.setMap(null);
  if (markerType === "end" && endMarker) endMarker.setMap(null);

  /* Criar um novo marcador */
  const marker = new google.maps.Marker
  ({
    position: position,
    map: map,
    title: markerType === "start" ? "Ponto Inicial" : "Ponto Final",
  });

  /* Salva os marcadores  */
  if (markerType === "start") 
  {
    startMarker = marker;
  } 
  else 
  {
    endMarker = marker;
  }
}

/* Calcula a rota entre os dois pontos */
function calculateRoute() 
{
  const preco = document.getElementById('preco');
  const distancia = document.getElementById('distancia');

  /* Configura a requisição de rota */
  const request = 
  {
    origin: startMarker.getPosition(),
    destination: endMarker.getPosition(),
    travelMode: google.maps.TravelMode.DRIVING, 
  };

  /* Chama o serviço de rotas */
  directionsService.route(request, (result, status) => 
  {
    if (status === google.maps.DirectionsStatus.OK) 
    {
      /* Exibe a rota no mapa */
      directionsRenderer.setDirections(result);

      /* Distância e tempo da API */
      const distanceInMeters = result.routes[0].legs[0].distance.value;
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);

      /* Calcula o preço estimado (1,50€) */
      const price = (distanceInKm * 1.50).toFixed(2);
     
      /*  Imprime os dados */
      let mensagempc = "Preço estimado: " + price + "€";
      let mensagemkm = "Distância: " + distanceInKm + "KM";
      document.getElementById("preco").innerHTML = mensagempc;
      document.getElementById("distancia").innerHTML = mensagemkm;

    } 
    else 
    {
      alert("Erro ao calcular a rota.");
      console.error("Erro no Directions API:", status);
    }
  });
}

