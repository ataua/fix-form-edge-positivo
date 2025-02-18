// Adicione seus seletores de campo de formulário e valores padrão aqui
const formFields = {	
    'input#nomeCliente': 'Não informado',
    'input#mailCliente': 'sememail@positivo.com.br',
    'input#rgCliente': '0',
    'input#valor': 30,
    'input#nfCompra': 0,
    'textarea#atendimento_ComentTroca': 'Troca direta',
    'textarea#atendimento_ComentChamada': '> Sintomas:\n- \n\n> Ações:\n- \n\n> Solução:\n- '
};

const checkName = ({target}) => {
    // Verifica se o nome tem 0 ou 1 elemento (ou seja, sem sobrenome)	
    const res = target.value.trim().split(" ");
    if (res.length <= 1){
        if (res[0] == ''){
            target.value = "Não informado";
        } else {
            alert("Nome incorreto!");
            target.focus();
        }
    }
}

const claimWarranty = () => {
	const spans = Array.from(document.querySelectorAll('span.text'))
	const garantia = spans.filter(s => s.innerText.includes('E0046'));
	!!garantia && garantia[0].parentElement.click() 
	const comment = document.querySelector('textarea#atendimento_ComentChamada')
	if (!!comment && !comment.value.toLowerCase().includes('chamado atp cfe')){
		comment.value += 'chamado atp cfe termo de garantia\n- ciente perda de dados'
	}
	setTimeout(()=>{
		const garantiaVarejo = Array.from(document.querySelectorAll('span.text')).filter(s => s.innerText == 'GARANTIA VAREJO');
		!!garantiaVarejo && garantiaVarejo[0].click() 
	}, 1000)
}

const createButton = () => {
    const targetDiv = document.querySelector('#div_dadosChamada .card-title div');
    if (targetDiv) {
        const newButton = document.createElement('button');
        newButton.innerText = 'Garantia';
		newButton.className = 'btn btn-blue';
        newButton.addEventListener('click', claimWarranty);
        targetDiv.insertBefore(newButton, targetDiv.firstChild);
    }
};

// Função para preencher campos de formulário vazios com valores padrão
const autoFillForm = () => {	

    // Itera através dos campos do formulário
    for (const [selector, defaultValue] of Object.entries(formFields)) {
        const field = document.querySelector(selector);
        if (!!field){
            if (!field.value.trim().length) {
                field.value = defaultValue;
            }

            if (field.id == 'nomeCliente') {
                field.addEventListener('change', checkName)
            } else if (field.id == 'atendimento_ComentChamada'){ 
                field.rows=12
            } else {
                field.addEventListener('change', ()=>{
                    if (!field.value || !field.value.trim().length) {
                        field.value = defaultValue;
                    }
                })
            }
        }
    }

    // Espera um pouco para garantir a atualização do DOM
    setTimeout(()=>{
        const spans = Array.from(document.querySelectorAll('span.text'))

        const fone = spans.filter(s => s.innerText == 'TELEFONE');
        !!fone.length && fone[0].parentElement.click()

        const preOs = spans.filter(s => s.innerHTML == ' ABERTURA DE PRE-OS');
        !!preOs.length && preOs[0].parentElement.click()

        //const crp = spans.filter(s => s.innerText == ' CRP');
        //!!crp.length && crp[0].parentElement.click()
    }, 200)
}

const run = () => {
	autoFillForm();
	createButton();
}

// Executa a função de preenchimento automático quando a página carrega
if (document.readyState === "loading") {	
    document.addEventListener("DOMContentLoaded", run );
} else {	// O DOM já está carregado
    run(); 
}
