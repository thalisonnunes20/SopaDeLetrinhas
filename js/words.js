/*
 * Banco de palavras do jogo.
 * Cada tema é uma lista de pares [palavra, dica].
 * A palavra pode ter acentos e hífen: eles aparecem na lista, mas são
 * removidos automaticamente ao montar a grade (ex.: "AÇÚCAR" -> "ACUCAR").
 * Para criar um tema novo, basta copiar um bloco e trocar os dados.
 */
(function (global) {
  'use strict';

  var THEMES = {
    animais: {
      nome: 'Animais',
      palavras: [
        ['GATO', 'Felino doméstico que ronrona'],
        ['CACHORRO', 'O melhor amigo do homem'],
        ['ELEFANTE', 'Tem tromba e orelhas enormes'],
        ['GIRAFA', 'Animal de pescoço bem comprido'],
        ['LEÃO', 'É chamado de rei da selva'],
        ['TARTARUGA', 'Carrega o casco nas costas'],
        ['COELHO', 'Orelhas longas e adora cenoura'],
        ['GOLFINHO', 'Mamífero marinho muito inteligente'],
        ['MACACO', 'Adora bananas e pular de galho em galho'],
        ['ZEBRA', 'Cavalo listrado da África'],
        ['PINGUIM', 'Ave que não voa e vive no gelo'],
        ['CAVALO', 'Pode ser montado e sai galopando'],
        ['CORUJA', 'Ave noturna de olhos grandes'],
        ['JACARÉ', 'Réptil de boca grande que vive nos rios'],
        ['BORBOLETA', 'Inseto de asas coloridas'],
        ['TUCANO', 'Ave de bico grande e colorido'],
        ['ABELHA', 'Produz o mel'],
        ['FORMIGA', 'Inseto pequeno que trabalha em grupo'],
        ['HIPOPÓTAMO', 'Gigante que passa o dia na água dos rios africanos'],
        ['RINOCERONTE', 'Tem um grande chifre sobre o focinho'],
        ['ORNITORRINCO', 'Mamífero australiano que bota ovos e tem bico de pato'],
        ['CAMALEÃO', 'Réptil que muda de cor'],
        ['TAMANDUÁ', 'Come formigas com a língua comprida'],
        ['CAPIVARA', 'Maior roedor do mundo'],
        ['BEIJA-FLOR', 'Ave minúscula que bate as asas muito rápido']
      ]
    },

    frutas: {
      nome: 'Frutas',
      palavras: [
        ['BANANA', 'Amarela e vem em cacho'],
        ['MORANGO', 'Vermelha, pequena e com sementes por fora'],
        ['LARANJA', 'Seu suco é rico em vitamina C'],
        ['MELANCIA', 'Verde por fora e vermelha por dentro'],
        ['ABACAXI', 'Tem coroa de folhas e casca áspera'],
        ['MANGA', 'Fruta tropical de polpa alaranjada'],
        ['LIMÃO', 'Azedo, ótimo para fazer limonada'],
        ['GOIABA', 'Dela se faz a goiabada'],
        ['CAJU', 'A castanha nasce do lado de fora'],
        ['PÊSSEGO', 'Casca aveludada e caroço grande'],
        ['MAMÃO', 'Alaranjado, com sementes pretas'],
        ['ACEROLA', 'Pequena, vermelha e cheia de vitamina C'],
        ['AMORA', 'Pequena e escura, nasce em arbusto'],
        ['COCO', 'Guarda uma água docinha dentro'],
        ['MARACUJÁ', 'Tem suco azedinho que acalma'],
        ['KIWI', 'Verde por dentro e peludo por fora'],
        ['PERA', 'Tem formato de sino'],
        ['JABUTICABA', 'Nasce direto no tronco da árvore'],
        ['TANGERINA', 'Também chamada de mexerica ou bergamota'],
        ['FRAMBOESA', 'Pequena e vermelha, muito usada em geleias'],
        ['ABACATE', 'Verde e cremoso, combina com açúcar ou sal'],
        ['CARAMBOLA', 'Cortada em fatias vira uma estrela'],
        ['GRAVIOLA', 'Grande, verde e coberta de espinhos moles'],
        ['PITANGA', 'Pequena, vermelha e canelada'],
        ['TAMARINDO', 'Vagem com polpa azedinha e pegajosa']
      ]
    },

    paises: {
      nome: 'Países',
      palavras: [
        ['BRASIL', 'Maior país da América do Sul'],
        ['ARGENTINA', 'Terra do tango'],
        ['PORTUGAL', 'País de Lisboa e do Porto'],
        ['ITÁLIA', 'Tem formato de bota e inventou a pizza'],
        ['FRANÇA', 'País da Torre Eiffel'],
        ['JAPÃO', 'Terra do sol nascente'],
        ['EGITO', 'Famoso por suas pirâmides'],
        ['CANADÁ', 'Tem uma folha de bordo na bandeira'],
        ['MÉXICO', 'Terra dos tacos e dos astecas'],
        ['CHILE', 'País comprido e estreito junto aos Andes'],
        ['PERU', 'Casa de Machu Picchu'],
        ['ÍNDIA', 'Terra do Taj Mahal'],
        ['CHINA', 'Tem uma grande muralha'],
        ['ESPANHA', 'Terra da paella e do flamenco'],
        ['ALEMANHA', 'País de Berlim e das salsichas'],
        ['URUGUAI', 'Vizinho do extremo sul do Brasil'],
        ['COLÔMBIA', 'País do café e de Bogotá'],
        ['AUSTRÁLIA', 'País-continente dos cangurus'],
        ['INGLATERRA', 'Parte do Reino Unido, com Londres'],
        ['DINAMARCA', 'País dos vikings e de Copenhague'],
        ['VENEZUELA', 'Vizinho ao norte do Brasil'],
        ['PARAGUAI', 'País sem litoral vizinho do Brasil'],
        ['MOÇAMBIQUE', 'País africano que fala português'],
        ['TAILÂNDIA', 'Terra dos templos e elefantes no Sudeste Asiático'],
        ['INDONÉSIA', 'País formado por milhares de ilhas']
      ]
    },

    corpo: {
      nome: 'Corpo humano',
      palavras: [
        ['CORAÇÃO', 'Bombeia o sangue pelo corpo'],
        ['PULMÃO', 'Órgão que usamos para respirar'],
        ['CÉREBRO', 'Controla pensamentos e movimentos'],
        ['JOELHO', 'Articulação no meio da perna'],
        ['COTOVELO', 'Articulação que dobra o braço'],
        ['OMBRO', 'Liga o braço ao tronco'],
        ['PESCOÇO', 'Sustenta a cabeça'],
        ['TORNOZELO', 'Articulação que liga o pé à perna'],
        ['LÍNGUA', 'Ajuda a sentir o gosto'],
        ['ORELHA', 'Usada para ouvir'],
        ['NARIZ', 'Sente os cheiros'],
        ['CABELO', 'Cresce na cabeça'],
        ['UNHA', 'Protege a ponta dos dedos'],
        ['PELE', 'Maior órgão do corpo'],
        ['COSTELA', 'Osso que protege o peito'],
        ['FÍGADO', 'Órgão que ajuda a filtrar o sangue'],
        ['DENTE', 'Serve para mastigar'],
        ['BOCHECHA', 'Fica dos lados do rosto'],
        ['ESTÔMAGO', 'Onde a comida é digerida'],
        ['INTESTINO', 'Tubo longo onde os nutrientes são absorvidos'],
        ['ARTICULAÇÃO', 'Ponto de encontro entre dois ossos'],
        ['PANTURRILHA', 'Músculo da parte de trás da perna'],
        ['ANTEBRAÇO', 'Parte do braço entre o cotovelo e o pulso'],
        ['CALCANHAR', 'Parte de trás do pé'],
        ['MANDÍBULA', 'Osso que movimenta o queixo']
      ]
    },

    cozinha: {
      nome: 'Cozinha',
      palavras: [
        ['PANELA', 'Usada para cozinhar no fogão'],
        ['FOGÃO', 'Tem bocas de fogo e forno'],
        ['GELADEIRA', 'Mantém os alimentos frios'],
        ['COLHER', 'Usada para tomar sopa'],
        ['GARFO', 'Tem dentes e espeta a comida'],
        ['FACA', 'Serve para cortar'],
        ['PRATO', 'Onde se serve a refeição'],
        ['COPO', 'Serve para beber água'],
        ['PENEIRA', 'Separa a farinha dos grumos'],
        ['CONCHA', 'Serve a sopa no prato'],
        ['TÁBUA', 'Superfície para cortar alimentos'],
        ['FORNO', 'Assa bolos e pães'],
        ['CHALEIRA', 'Esquenta a água para o chá'],
        ['TIGELA', 'Vasilha funda para sopas e cereais'],
        ['ABRIDOR', 'Ajuda a abrir latas e garrafas'],
        ['ESCORREDOR', 'Tira a água do macarrão'],
        ['FRIGIDEIRA', 'Usada para fritar ovos'],
        ['XÍCARA', 'Para tomar café ou chá'],
        ['LIQUIDIFICADOR', 'Bate vitaminas e sucos'],
        ['MICRO-ONDAS', 'Esquenta a comida rapidinho'],
        ['DESCASCADOR', 'Tira a casca de legumes e frutas'],
        ['RALADOR', 'Transforma queijo em fios'],
        ['ESPÁTULA', 'Vira panqueca e mexe a massa'],
        ['TORRADEIRA', 'Dá cor e crocância ao pão'],
        ['AÇUCAREIRO', 'Pote onde se guarda o açúcar']
      ]
    },

    natureza: {
      nome: 'Natureza',
      palavras: [
        ['MONTANHA', 'Grande elevação de terra e rocha'],
        ['FLORESTA', 'Muitas árvores juntas'],
        ['CACHOEIRA', 'Queda de água em um rio'],
        ['PRAIA', 'Areia, sol e mar'],
        ['VULCÃO', 'Pode entrar em erupção'],
        ['DESERTO', 'Muito seco e cheio de areia'],
        ['OCEANO', 'Enorme massa de água salgada'],
        ['ARCO-ÍRIS', 'Aparece depois da chuva com sol'],
        ['TROVÃO', 'Barulho forte da tempestade'],
        ['RELÂMPAGO', 'Clarão no céu durante a tempestade'],
        ['NUVEM', 'Flutua no céu e traz chuva'],
        ['ESTRELA', 'Brilha no céu à noite'],
        ['PLANETA', 'Gira em torno de uma estrela'],
        ['CAVERNA', 'Buraco grande dentro da rocha'],
        ['PANTANAL', 'Maior planície alagada do mundo'],
        ['ILHA', 'Terra cercada de água por todos os lados'],
        ['LAGO', 'Água parada cercada de terra'],
        ['CAMPO', 'Terreno aberto com plantas e animais'],
        ['TEMPESTADE', 'Chuva forte com raios e trovões'],
        ['FURACÃO', 'Ventania giratória gigantesca'],
        ['TERREMOTO', 'Tremor forte do solo'],
        ['ARQUIPÉLAGO', 'Conjunto de ilhas'],
        ['CORDILHEIRA', 'Longa cadeia de montanhas'],
        ['ATMOSFERA', 'Camada de ar que envolve a Terra'],
        ['HORIZONTE', 'Linha onde o céu parece encontrar a terra']
      ]
    }
  };

  global.THEMES = THEMES;
})(window);
