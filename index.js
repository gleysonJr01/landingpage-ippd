// ==========================================
// FILTRO DE DIAS
// ==========================================

const botoesDias = document.querySelectorAll('.botoes-de-opcoes');

const programacoes = document.querySelectorAll(
    '#programacoes-carousel .item-de-programacao'
);

const enderecos = document.querySelectorAll(
    '#enderecos-carousel .item-de-programacao'
);

const todosCards = [...programacoes, ...enderecos];


// ==========================================
// FUNÇÃO DE CRIAÇÃO DO CARROSSEL
// ==========================================

function criarCarousel(carouselElement, btnPrev, btnNext) {

    const track = carouselElement.querySelector(
        '.container-grupos-de-itens-de-programacoes'
    );

    let currentPosition = 0;


    // Calcula quanto o carrossel deve avançar
    function getStep() {

        const card = [...track.querySelectorAll('.item-de-programacao')]
            .find(card => card.style.display !== 'none');

        if (!card) return 0;

        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap) || 0;

        return card.offsetWidth + gap;
    }


    // Calcula o limite máximo de scroll
    function getMaxPosition() {

        return Math.max(
            0,
            track.scrollWidth - carouselElement.clientWidth
        );
    }


    // Atualiza a posição e o estado das setas
    function updateCarousel() {

        const maxPosition = getMaxPosition();

        currentPosition = Math.max(
            0,
            Math.min(currentPosition, maxPosition)
        );

        track.style.transform = `translateX(-${currentPosition}px)`;

        btnPrev.disabled = currentPosition <= 0;
        btnNext.disabled = currentPosition >= maxPosition;
    }


    // Avançar
    btnNext.addEventListener('click', () => {

        currentPosition += getStep();

        updateCarousel();

    });


    // Retroceder
    btnPrev.addEventListener('click', () => {

        currentPosition -= getStep();

        updateCarousel();

    });


    // Atualiza quando a tela mudar de tamanho
    window.addEventListener('resize', updateCarousel);


    // Inicializa o carrossel
    updateCarousel();


    // Permite resetar o carrossel externamente
    return {

        reset: () => {

            currentPosition = 0;

            updateCarousel();

        },

        update: updateCarousel

    };

}


// ==========================================
// INICIALIZAÇÃO DOS CARROSSEIS
// ==========================================

const carouselProgramacoes = criarCarousel(
    document.querySelector('#programacoes-carousel'),
    document.querySelector('.carousel-btn-prev'),
    document.querySelector('.carousel-btn-next')
);


const carouselEnderecos = criarCarousel(
    document.querySelector('#enderecos-carousel'),
    document.querySelector('.carousel-endereco-btn-prev'),
    document.querySelector('.carousel-endereco-btn-next')
);


// ==========================================
// FILTRO DOS CARDS
// ==========================================

botoesDias.forEach(botao => {

    botao.addEventListener('click', () => {

        // Remove o active de todos os botões
        botoesDias.forEach(btn => {
            btn.classList.remove('active');
        });


        // Ativa o botão selecionado
        botao.classList.add('active');


        // Obtém o dia selecionado
        const diaSelecionado = botao.dataset.dia;


        // Filtra os cards
        todosCards.forEach(card => {

            if (diaSelecionado === 'Todos') {

                card.style.display = 'flex';

            } else {

                const dias = card.dataset.dia.split(' ');

                if (dias.includes(diaSelecionado)) {

                    card.style.display = 'flex';

                } else {

                    card.style.display = 'none';

                }

            }

        });


        // Reseta os dois carrosséis após o filtro
        requestAnimationFrame(() => {

            carouselProgramacoes.reset();

            carouselEnderecos.reset();

        });

    });

});


// ==========================================
// ATUALIZAÇÃO INICIAL
// ==========================================

window.addEventListener('load', () => {

    carouselProgramacoes.update();

    carouselEnderecos.update();

});