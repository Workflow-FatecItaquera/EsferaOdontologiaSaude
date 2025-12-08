function buscaCep(cep){
    if(cep.value.length>=8){
        fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
        .then(response=>response.json())
        .then(response=>{
            console.log(response)
            document.querySelector('#estado').value = response.estado
            document.querySelector('#bairro').value = response.bairro
            document.querySelector('#cidade').value = response.localidade
            document.querySelector('#logradouro').value = response.logradouro
        })
        .catch(error=>{
            console.error(error)
        })
    }
}