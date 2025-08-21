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

const selectSpan = (relation, text) => {
    // clica no span que tem conteúdo textual buscado
    const spans = Array.from(document.querySelectorAll('span.text'))
    switch (relation) {
        case 'is': // conteúdo exatamente igual
            spans.find(b => b.textContent.toLowerCase() == text)?.click() 
            break
        case 'has': // parte do texto
            spans.find(b => b.textContent.toLowerCase().includes(text))?.click() 
            break
        default:
            console.warn('use: selectSpan(relation = "has" | "is", text)')
    }
}

const today = () => document.querySelector('input#dataCompra').value = document.querySelector('input#numDiasPend').value

const fixWidth = () => {
    ['col-lg-offset-1', 'col-lg-10'].forEach(cl => document.querySelectorAll(`.${cl}`).forEach(c => c.classList.remove(cl)))
    const tt = document.querySelector('.card-title>div')
    if (!!tt) tt.style.width = ''
}

const checkName = ({ target }) => {
    // Verifica se o nome tem 0 ou 1 elemento (ou seja, sem sobrenome)	
    const res = target.value.trim().split(" ");
    if (!res || res.length <= 1) {
        if (res[0] == '') {
            target.value = "Não informado";
        } else {
            alert("Nome incorreto!");
            target.focus();
        }
    }
}

const setSintoma = () => {
    document.querySelector('#ligacaoCaiu')?.addEventListener('click', ()=>selectSpan('is', 'danificado'))
}


const checkIsOnSite = () => {
    const setIsOnSite = () => {
        const modalidade = document.querySelector('#modalidade')
        if (!!modalidade && modalidade.value.toLowerCase().includes('on site')) {
            document.querySelector('#clientes_cpf').value = document.querySelector('#clienteSAP_cnpj')?.value
            document.querySelector('#carregarDados')?.click()
            selectSpan('has', '(e0001)')
            setTimeout(() => {
                selectSpan('has', 'solicitação de atendimento on-site')
                clearInterval(isOnSite)
            }, 1200)
        }
    }
    const isOnSite = setInterval(setIsOnSite, 1000)
    setTimeout(() => clearInterval(isOnSite), 10000)
}

const claimWarranty = (ev) => {
    ev.preventDefault()
    selectSpan('has', '(e0046)')
    const comment = document.querySelector('textarea#atendimento_ComentChamada')
    if (!!comment && (!comment.value.toLowerCase().includes('chamado atp cfe') && !comment.value.toLowerCase().includes('orçamento'))) {
        comment.value += 'chamado atp cfe termo de garantia\n- ciente perda de dados'
    }
    setTimeout(() => selectSpan('is', 'garantia varejo'), 1000)
}

const noSN = (ev) => {
    ev.preventDefault()
    setTimeout(()=>{
        selectSpan('has', 'e0025')
        selectSpan('has', 'dados insuficientes')
        selectSpan('has', 'não identificado')
    }, 1100)
    const comment = document.querySelector('textarea#atendimento_ComentChamada')
    if (!!comment && (!comment.value.toLowerCase().includes('sem ns'))) {
        comment.value += 'Sem NS\n- Sem aparelho em mãos'
    } 
    selectSpan('is', 'não identificado')
    today()
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

    document.querySelector('#ligacaoCaiu')?.addEventListener('click', ()=>{
        const comment = document.querySelector('textarea#atendimento_ComentChamada')
        if (!!comment && (!comment.value.toLowerCase().includes('caiu'))) {
            comment.value += 'Ligação muda / caiu'
        }
        today()
        selectSpan('is', 'não identificado')
    })
};

// Função para preencher campos de formulário vazios com valores padrão
const autoFillForm = () => {

    // Itera através dos campos do formulário
    for (const [selector, defaultValue] of Object.entries(formFields)) {
        const field = document.querySelector(selector);
        if (!!field) {
            if (!field.value || !field.value.trim()) {
                field.value = defaultValue;
            }

            if (field.id == 'nomeCliente') {
                field.addEventListener('change', checkName)
            } else if (field.id == 'atendimento_ComentChamada') {
                field.rows = 12
            } else {
                field.addEventListener('change', () => {
                    if (!field.value.trim().length) {
                        field.value = defaultValue;
                    }
                })
            }
        }
    }

    // Espera um pouco para garantir a atualização do DOM
    setTimeout(() => {
        selectSpan('is', 'telefone')
        selectSpan('has', 'abertura de pre-os')
        selectSpan('is', 'crp')
    }, 200)
}

const run = () => {
    autoFillForm();
    fixWidth();
    createButtons();
    checkIsOnSite();
    document.querySelector('textarea#atendimento_ComentChamada')?.focus()
}

// Executa a função de preenchimento automático quando a página carrega
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
} else {	// O DOM já está carregado
    run();
}