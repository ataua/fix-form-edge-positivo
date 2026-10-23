const selectSpan = (relation, text) => {
    /**
     * clica no span que tem conteúdo textual buscado
     **/
   const spans = Array.from(document.querySelectorAll('span.text'))
    switch (relation) {
        case 'is': // conteúdo exatamente igual
            spans.find(b => b.textContent.toLowerCase().trim() == text)?.click() 
            break
        case 'has': // parte do texto
            spans.find(b => b.textContent.toLowerCase().trim().includes(text))?.click() 
            break
        default:
            console.warn('use: selectSpan(relation = "has" | "is", text)')
    }
}

const noZeroCPF = () => {
    /**
     * Desabilita o botão de pesquisa se o CPF/CNPJ for 0
     **/
    document.querySelector('#cpfcnpj')?.addEventListener('input', ({target})=>{
        if (target?.value == 0){
            document.querySelector('#pesq_os button').disabled = true
            document.querySelector('#pesq_os button').style.cursor = 'not-allowed !important'
        } else {
            document.querySelector('#pesq_os button').disabled = false
            document.querySelector('#pesq_os button').style.cursor = 'default'
        }
    })
}

// Função para definir a data de hoje em um campo de data
const today = () => document.querySelector('input#dataCompra').value = document.querySelector('input#numDiasPend').value


const fixView = () => {
    /**
     * Ajustes visuais na interface
     */
    ['col-lg-offset-1', 'col-lg-10'].forEach(cl => document.querySelectorAll(`.${cl}`).forEach(c => c.classList.remove(cl)))
    Array.from(document.querySelectorAll('.form-group')).forEach(el => el.style.marginBottom = "5px");
    Array.from(document.querySelectorAll('.form-group label')).forEach(el => el.style.marginBottom = "0");
    const tt = document.querySelector('.card-title>div')
    if (!!tt) tt.style.width = 'fit-content'
    const btnNew = document.querySelector('#continuar');
    if (!!btnNew) btnNew.style.marginBottom = '6rem';
}

const checkName = ({ target }) => {
    /**
     * Verifica se o nome tem sobrenome
     **/
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

const checkIsOnSite = () => {
    /**
     * Verifica se a modalidade é on site e seleciona os spans corretos
     **/
    const setIsOnSite = () => {
        const modalidade = document.querySelector('#modalidade')
        if (!!modalidade && modalidade.value.toLowerCase().includes('on site')) {
            document.querySelector('#clientes_cpf').value = document.querySelector('#clienteSAP_cnpj')?.value
            document.querySelector('#carregarDados')?.click()
            selectSpan('has', '(e0001)')
            setTimeout(() => {
                selectSpan('is', 'solicitação de atendimento on-site')
                clearInterval(isOnSite)
            }, 1200)
        }
    }
    const isOnSite = setInterval(setIsOnSite, 1000)
    setTimeout(() => clearInterval(isOnSite), 10000)
}

const claimWarranty = (ev) => {
    /**
     * Clica nos spans corretos e adiciona comentário padrão para chamados de garantia
     **/
    ev.preventDefault()
    selectSpan('has', '(e0046)')
    const comment = document.querySelector('textarea#atendimento_ComentChamada')
    if (!!comment && (!comment.value.toLowerCase().includes('chamado atp cfe') && !comment.value.toLowerCase().includes('orçamento'))) {
        comment.value += 'chamado atp cfe termo de garantia\n- ciente perda de dados'
    }
    setTimeout(() => selectSpan('is', 'garantia varejo'), 1000)
}

const noSN = (ev) => {
    /**
     * Clica nos spans corretos e adiciona comentário padrão para chamados sem número de série
     **/
    ev.preventDefault()
    setTimeout(()=>{
        selectSpan('has', 'e0025')
        selectSpan('is', 'dados insuficientes para atendimento')
    }, 1100)
    const comment = document.querySelector('textarea#atendimento_ComentChamada')
    if (!!comment && (!comment.value.toLowerCase().includes('sem ns'))) {
        comment.value += 'Sem NS\n- Sem aparelho em mãos'
    } 
    today()
}

const dropped = () => {
    const comment = document.querySelector('textarea#atendimento_ComentChamada')
    if (!!comment && (!comment.value.toLowerCase().includes('caiu') && !comment.value.toLowerCase().includes('Muda'))) {
        comment.value += 'Ligação caiu / Muda'
        selectSpan('has', 'caiu/muda')
        today()
    }
}

const createButtons = () => {
    /**
     * Cria botões extras na interface para ações rápidas
     **/
    const targetDiv = document.querySelector('#div_dadosChamada .card-title div');
    if (!!targetDiv) {

        const newButtonCaiu = document.createElement('button');
        newButtonCaiu.style.marginLeft = '4px';
        newButtonCaiu.textContent = 'Caiu/Muda';
        newButtonCaiu.className = 'btn btn-blue';
        newButtonCaiu.addEventListener('click', dropped);
        targetDiv.insertBefore(newButtonCaiu, targetDiv.firstChild);

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
    const targetDiv1 = document.querySelector('#cadastro .card-title:first-of-type');
    if (!!targetDiv1) {
        const newButtonReset = document.createElement('button');
        newButtonReset.style.margin = '-10px 20px';
        newButtonReset.innerHTML = '&orarr;';
        newButtonReset.className = 'btn btn-blue';
        newButtonReset.addEventListener('click', () => document.forms[1].submit());
        targetDiv1.appendChild(newButtonReset);
    }
    document.querySelector('#ligacaoCaiu')?.remove()
};

const formFields = {
    /**
     * Adicione seus seletores de campo de formulário e valores padrão aqui
     **/ 
    // 'input#nomeCliente': 'Não informado',
    'input#mailCliente': 'sememail@positivo.com.br',
    'input#rgCliente': '0',
    'input#valor': 30,
    'input#nfCompra': 0,
    'textarea#atendimento_ComentTroca': 'Troca direta',
    'textarea#atendimento_ComentChamada': '> Sintomas:\n- \n\n> Ações:\n- \n\n> Solução:\n- '
};

const autoFillForm = () => {
    /**
     * Preenche os campos do formulário com valores padrão
     **/

    // Itera através dos campos do formulário
    for (const [selector, defaultValue] of Object.entries(formFields)) {
        const field = document.querySelector(selector);
        if (!!field) {
            
            if (!String(field.value).trim().length) {
                field.value = defaultValue;
            }

            field.addEventListener('change', () => {
                if (!String(field.value).trim().length) {
                    field.value = defaultValue;
                }
            })

            if (field.id == 'atendimento_ComentChamada') field.rows = 12;
            // else if (field.id == 'nomeCliente') field.addEventListener('change', checkName)
        }
    }

    // Espera um pouco para garantir a atualização do DOM
    setTimeout(() => {
        selectSpan('is', 'telefone')
        selectSpan('is', 'abertura de pre-os')
        selectSpan('is', 'crp')
        selectSpan('is', 'cliente')
        selectSpan('is', 'pac')
        selectSpan('is', 'fabrica - falha do produto')
    }, 300)
}

const run = () => {
    autoFillForm();
    fixView();
    noZeroCPF()
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