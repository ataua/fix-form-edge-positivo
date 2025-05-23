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

const fixWidth = () => {
    ['col-lg-offset-1', 'col-lg-10'].forEach(cl => document.querySelectorAll(`.${cl}`).forEach(c => c.classList.remove(cl)))
    const tt = document.querySelector('.card-title>div')
    if (!!tt) tt.style.width = ''
}

const checkName = ({ target }) => {
    // Verifica se o nome tem 0 ou 1 elemento (ou seja, sem sobrenome)	
    const res = target.value.trim().split(" ");
    if (res <= 1) {
        if (res[0] == '') {
            target.value = "Não informado";
        } else {
            alert("Nome incorreto!");
            target.focus();
        }
    }
}

const checkIsOnSite = () => {
    const setIsOnSite = () => {
        const modalidade = document.querySelector('#modalidade')
        if (!!modalidade && modalidade.value.toLowerCase().includes('on site')) {
            let spans = Array.from(document.querySelectorAll('span.text'))
            document.querySelector('#clientes_cpf').value = document.querySelector('#clienteSAP_cnpj').value
            const carregar = document.querySelector('#carregarDados')
            !!carregar && carregar.click()
            const situacao = spans.find(s => s.textContent.toLowerCase().includes('(e0001)'))
            !!situacao && situacao.parentElement.click()
            !!situacao && setTimeout(() => {
                let spans = Array.from(document.querySelectorAll('span.text'))
                const solicita = spans.find(s => s.textContent.toLowerCase().includes('solicitação de atendimento on-site'))
                !!solicita && solicita.parentElement.click()
            }, 1200)
            clearInterval(isOnSite)

        }
    }
    const isOnSite = setInterval(setIsOnSite, 1000)
}

const claimWarranty = (ev) => {
    ev.preventDefault()
    const spans = Array.from(document.querySelectorAll('span.text'))
    const garantia = spans.find(s => s.textContent.includes('E0046'));
    !!garantia && garantia.parentElement.click()
    const comment = document.querySelector('textarea#atendimento_ComentChamada')
    if (!!comment && (!comment.value.toLowerCase().includes('chamado atp cfe') && !comment.value.toLowerCase().includes('orçamento'))) {
        comment.value += 'chamado atp cfe termo de garantia\n- ciente perda de dados'
    }
    setTimeout(() => {
        const garantiaVarejo = Array.from(document.querySelectorAll('span.text')).find(s => s.textContent == 'GARANTIA VAREJO');
        !!garantiaVarejo && garantiaVarejo.click()
    }, 1000)
}

const noSN = (ev) => {
    ev.preventDefault()
    const spans = Array.from(document.querySelectorAll('span.text'))
    const insuficiente = spans.find(s => s.textContent.includes('DADOS INSUFICIENTES'));
    !!insuficiente && insuficiente.parentElement.click()
    const danificado = spans.find(b => b.textContent.includes("NÃO IDENTIFICADO"))
    !!danificado && danificado.click()
    const comment = document.querySelector('textarea#atendimento_ComentChamada')
    document.querySelector('input#dataCompra').value = document.querySelector('input#numDiasPend').value
    if (!!comment && (!comment.value.toLowerCase().includes('sem ns'))) {
        comment.value = '> Sintomas:\n-\n\n> Ações:\n- Sem NS\n- Sem aparelho em mãos\n\n> Solução:\n- Volta a ligar'
    }
}

const createButtons = () => {
    const targetDiv = document.querySelector('#div_dadosChamada .card-title div');
    if (!!targetDiv) {
        const newButtonGarantia = document.createElement('button');
        newButtonGarantia.style.marginLeft = '4px';
        newButtonGarantia.textContent = 'Garantia';
        newButtonGarantia.className = 'btn btn-blue';
        newButtonGarantia.addEventListener('click', claimWarranty);
        targetDiv.insertBefore(newButtonGarantia, targetDiv.firstChild);

        const newButtonNoSN = document.createElement('button');
        newButtonNoSN.style.marginLeft = '4px';
        newButtonNoSN.textContent = 'Sem NS';
        newButtonNoSN.className = 'btn btn-blue';
        newButtonNoSN.addEventListener('click', noSN);
        targetDiv.insertBefore(newButtonNoSN, targetDiv.firstChild);
    }
};

// Função para preencher campos de formulário vazios com valores padrão
const autoFillForm = () => {

    // Itera através dos campos do formulário
    for (const [selector, defaultValue] of Object.entries(formFields)) {
        const field = document.querySelector(selector);
        if (!!field) {
            if (!field.value.trim()) {
                field.value = defaultValue;
            }

            if (field.id == 'nomeCliente') {
                field.addEventListener('change', checkName)
            } else if (field.id == 'atendimento_ComentChamada') {
                field.rows = 12
            } else {
                field.addEventListener('change', () => {
                    if (!field.value || !field.value.trim()) {
                        field.value = defaultValue;
                    }
                })
            }

        }
    }

    // Espera um pouco para garantir a atualização do DOM
    setTimeout(() => {
        let spans = Array.from(document.querySelectorAll('span.text'))

        const telefone = spans.find(s => s.textContent.trim() == ('TELEFONE'))
        !!telefone && telefone.parentElement.click()

        const preOs = spans.find(s => s.textContent.trim().includes('ABERTURA DE PRE-OS'))
        !!preOs && preOs.parentElement.click()

        const crp = spans.find(s => s.textContent.trim() == ('CRP'))
        !!crp && crp.parentElement.click()

    }, 200)
}

const run = () => {
    autoFillForm();
    fixWidth();
    createButtons();
    checkIsOnSite();
    document.querySelector('textarea#atendimento_ComentChamada').focus()
}

// Executa a função de preenchimento automático quando a página carrega
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
} else {	// O DOM já está carregado
    run();
}