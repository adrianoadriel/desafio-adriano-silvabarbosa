class CaixaDaLanchonete {
    constructor(){
        this.precoDosItens = {
            cafe: 3.00,
            chantily: 1.50,
            suco: 6.20,
            sanduiche: 6.50,
            queijo: 2.00,
            salgado: 7.25,
            combo1: 9.50,
            combo2: 7.50
        };
        this.itensDaLanchonete = new Set(Object.keys(this.precoDosItens))

    } 
    calcularValorDaCompra(metodoDePagamento, itens) {
        if (!this.validaSeExisteItens(itens)) {
            return "Não há itens no carrinho de compra!"
        }
        if(!this.validaFormatoDosItens(itens)){
            return "Item inválido!"
        }
        let novoArrayDeItens = this.transformarArrayDeItens(itens);

        if (!this.validaItens(novoArrayDeItens)) {
            return "Item inválido!"
        }
        if (!this.validaMetodoDePagamento(metodoDePagamento)) {
            return "Forma de pagamento inválida!"
        }
        if (!this.validaQuantidadeDosItens(novoArrayDeItens)) {
            return "Quantidade inválida!"
        }
        if (!this.validaSePodeAdicionarItemExtra(novoArrayDeItens)) {
            return "Item extra não pode ser pedido sem o principal"
        }
       
        const precoParcial = this.calculaPrecoParcial(novoArrayDeItens)
        const precoFinal = this.calculaPrecoFinal(precoParcial, metodoDePagamento)
        const precoFinalFormatado = precoFinal.toFixed(2).replaceAll('.', ',')
        return `R$ ${precoFinalFormatado}`
    }
    validaSeExisteItens(itens) {
        let existeItens = true;
        if (!itens.length) {
            existeItens = false;
        }
        return existeItens;
    }
    validaFormatoDosItens(itens){
        let formatoValido = true;
        const pattern = /^[a-zA-Z]+\,\s*\d+$/
        for(const item of itens){
            if(!pattern.test(item)){
                formatoValido = false;
                break
            }
        }
        return formatoValido;
    }
    transformarArrayDeItens(itens) {
        const novoArrayDeItens = itens.map((item) => {
            const arrayDoItem = item.split(',');
            return { nome: arrayDoItem[0], quantidade: Number(arrayDoItem[1]) };
        })
        return novoArrayDeItens;
    }
    validaMetodoDePagamento(metodoPagamento) {
        let valido = false;
        if (metodoPagamento === 'debito' || metodoPagamento === 'credito' || metodoPagamento === 'dinheiro') {
            valido = true;
        }
        return valido
    }
    validaItens(itens) {
        let valido = true;
        for (const item of itens) {
            if(!this.itensDaLanchonete.has(item.nome)){
                valido = false
            }
            if (!valido) {
                break;
            }
        };
        return valido;
    }
    validaQuantidadeDosItens(itens) {
        let valido = true;
        for (const item of itens) {
            if (item.quantidade <= 0) {
                valido = false;
                break;
            }
        }
        return valido;
    }
    validaSePodeAdicionarItemExtra(itens) {
        let podePedirChantily = true;
        let podePedirQueijo = true;

        for (const item of itens) {
            if (item.nome === "chantily" && !itens.some((i) => i.nome === "cafe")) {
                podePedirChantily = false;
            }
            if (item.nome === "queijo" && !itens.some((i) => i.nome === "sanduiche")) {
                podePedirQueijo = false;
            }
        }
        let podeItemExtra = podePedirChantily && podePedirQueijo
        return podeItemExtra;
    }
    calculaPrecoParcial(itens) {
        let precoParcial = 0;
        itens.forEach(item => {
            for(const itemDaLanchonete of this.itensDaLanchonete){
                if(item.nome == itemDaLanchonete){
                    precoParcial += this.precoDosItens[itemDaLanchonete] * item.quantidade;
                }
            }
        });
        return precoParcial;
    }
    calculaPrecoFinal(precoParcial, metodoDePagamento) {
        let precoFinal = 0;
        switch (metodoDePagamento) {
            case 'dinheiro':
                precoFinal = precoParcial - (precoParcial * 5 / 100);
                break;
            case 'credito':
                precoFinal = precoParcial + (precoParcial * 3 / 100);
                break;
            case 'debito':
                precoFinal = precoParcial;
                break;
        }
        return precoFinal;

    }
}

export { CaixaDaLanchonete };
