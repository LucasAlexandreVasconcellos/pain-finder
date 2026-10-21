"""High-quality Dark Quiz script generator for TikTok channel @bussinessmasterbr.

Generates viral-engineered quiz scripts for the 3 daily posting slots:
- 12:30 (Lunch / General Knowledge & Fast Curiosities)
- 16:00 (Afternoon Break / Corporate Giants & Billionaire Secrets)
- 18:30 (Prime Time / Supreme IQ Challenge & Impossible Mind Benders)

CLI usage:
    python -m src.scripts.generator --slot 12:30 --output data/scripts/script_1230.json
    python -m src.scripts.generator --slot all --output-dir data/scripts/ --with-guide
"""

import argparse
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from src.scripts.schema import (
    BonusQuestionBlock,
    DarkQuizScript,
    HookBlock,
    MicroCuriosityBlock,
    QuestionAudioCues,
    QuestionItem,
    QuizOption,
    ScoreCTABlock,
    SEOMetadata,
    VoiceConfig,
)

__all__ = [
    "DarkQuizGenerator",
    "generate_daily_scripts",
    "generate_script",
    "generate_quiz_script",
    "get_preset_script",
    "list_available_slots",
]


def _build_preset_1230() -> DarkQuizScript:
    """Preset for Slot 12:30 - Lunch / General Knowledge & Pop Culture."""
    return DarkQuizScript(
        script_id="script_1230_general_knowledge_01",
        slot="12:30",
        theme="Conhecimentos Gerais do Cotidiano & Marcas Mundiais",
        target_duration_seconds=72.0,
        voice_config=VoiceConfig(voice_name="pt-BR-AntonioNeural", rate="+5%", pitch="+0Hz"),
        hook=HookBlock(
            hook_text="Seu cérebro é acima da média ou você erra coisas simples? Cuidado com a pergunta número 5, quase todo mundo cai!",
            subtitles_highlight="⚠️ 98% ERRAM A #5! VOCÊ ACERTA?",
            duration_seconds=4.0,
            sfx="sfx_whoosh_impact",
        ),
        questions=[
            QuestionItem(
                index=1,
                level="facil",
                level_badge="🟢 NÍVEL FÁCIL",
                question_text="Qual país é o berço e criador da pizza moderna?",
                options=[
                    QuizOption(id="A", text="França"),
                    QuizOption(id="B", text="Itália"),
                    QuizOption(id="C", text="Grécia"),
                    QuizOption(id="D", text="Espanha"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="A pizza moderna com molho e queijo nasceu em Nápoles, na Itália!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=2,
                level="facil",
                level_badge="🟢 NÍVEL FÁCIL",
                question_text="Qual empresa multinacional criou o smartphone iPhone?",
                options=[
                    QuizOption(id="A", text="Microsoft"),
                    QuizOption(id="B", text="Samsung"),
                    QuizOption(id="C", text="Apple"),
                    QuizOption(id="D", text="Google"),
                ],
                correct_option="C",
                correct_index=2,
                explanation="O primeiro iPhone foi apresentado por Steve Jobs na Apple em 2007!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=3,
                level="medio",
                level_badge="🟡 NÍVEL MÉDIO",
                question_text="Qual é a moeda oficial utilizada no Japão?",
                options=[
                    QuizOption(id="A", text="Yuan"),
                    QuizOption(id="B", text="Won"),
                    QuizOption(id="C", text="Iene"),
                    QuizOption(id="D", text="Dólar"),
                ],
                correct_option="C",
                correct_index=2,
                explanation="O Iene é a moeda oficial do Japão e a 3ª mais negociada do mundo!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=4,
                level="medio",
                level_badge="🟡 NÍVEL MÉDIO",
                question_text="Em que ano o ser humano pisou na Lua pela primeira vez?",
                options=[
                    QuizOption(id="A", text="1959"),
                    QuizOption(id="B", text="1969"),
                    QuizOption(id="C", text="1975"),
                    QuizOption(id="D", text="1982"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="Neil Armstrong e Buzz Aldrin pisaram na Lua em 20 de julho de 1969!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=5,
                level="dificil",
                level_badge="🔴 NÍVEL DIFÍCIL - PEGADINHA",
                question_text="Quantos meses do ano têm 28 dias?",
                options=[
                    QuizOption(id="A", text="Apenas 1"),
                    QuizOption(id="B", text="2 meses"),
                    QuizOption(id="C", text="6 meses"),
                    QuizOption(id="D", text="Todos os 12"),
                ],
                correct_option="D",
                correct_index=3,
                explanation="Pegadinha! Fevereiro tem 28 dias, mas todos os outros 11 meses também passam pelo 28º dia!",
                is_trap=True,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(intro="sfx_warning_siren", countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=6,
                level="dificil",
                level_badge="🔴 NÍVEL DIFÍCIL",
                question_text="Qual é a empresa mais antiga do mundo ainda em atividade contínua?",
                options=[
                    QuizOption(id="A", text="Nintendo"),
                    QuizOption(id="B", text="Kongo Gumi"),
                    QuizOption(id="C", text="Beretta"),
                    QuizOption(id="D", text="Twinings"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="A Kongo Gumi foi fundada no Japão em 578 d.C. e constrói templos há mais de 1.400 anos!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=7,
                level="impossivel",
                level_badge="💀 NÍVEL IMPOSSÍVEL",
                question_text="Qual país do planeta possui o maior número de ilhas em seu território?",
                options=[
                    QuizOption(id="A", text="Indonésia"),
                    QuizOption(id="B", text="Filipinas"),
                    QuizOption(id="C", text="Suécia"),
                    QuizOption(id="D", text="Canadá"),
                ],
                correct_option="C",
                correct_index=2,
                explanation="A Suécia lidera o mundo com mais de 267 mil ilhas registradas!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
        ],
        micro_curiosity=MicroCuriosityBlock(
            insert_after_question=3,
            title="💡 CURIOSIDADE RELÂMPAGO",
            text="Você sabia? A Apple começou na garagem de Steve Jobs e hoje tem mais dinheiro em caixa do que muitos países ricos!",
            duration_seconds=4.0,
            sfx="sfx_curiosity_bell",
        ),
        score_cta=ScoreCTABlock(
            text="Quantas você acertou de verdade? Deixe seu placar nos comentários!",
            duration_seconds=3.0,
        ),
        bonus_question=BonusQuestionBlock(
            index=8,
            badge_label="🔥 PERGUNTA BÔNUS",
            question_text="Quem foi o primeiro bilionário em dólares registrado na história da humanidade? Quem acertar ganha comentário fixado!",
            options=["A) Henry Ford", "B) John D. Rockefeller", "C) Andrew Carnegie", "D) J.P. Morgan"],
            correct_answer_secret="John D. Rockefeller (fundador da Standard Oil, atingiu a marca em 1916)",
            reveal_in_video=False,
            duration_seconds=6.0,
            pinned_comment="🏆 DESAFIO BÔNUS: O primeiro bilionário em dólares da história foi John D. Rockefeller (Standard Oil) em 1916! Quem acertou essa?",
        ),
        seo=SEOMetadata(
            title="Desafio dos 7 Níveis: 98% Erram a Pergunta 5! Quantas Você Acerta?",
            caption="Você consegue acertar todas as 7 perguntas de conhecimentos gerais? Preste muita atenção na pegadinha da número 5! 🧠👇 Deixe seu placar nos comentários e tente responder a pergunta bônus!",
            hashtags=[
                "#quiz",
                "#curiosidades",
                "#conhecimento",
                "#quizdark",
                "#desafio",
                "#fatosdesconhecidos",
                "#bussinessmasterbr",
                "#quizbrasil",
                "#aprendanotiktok",
            ],
            cover_headline="98% ERRAM A #5! VOCÊ ACERTA?",
        ),
    )


def _build_preset_1600() -> DarkQuizScript:
    """Preset for Slot 16:00 - Afternoon Break / Corporate Giants & Billionaire Secrets."""
    return DarkQuizScript(
        script_id="script_1600_business_giants_02",
        slot="16:00",
        theme="Segredos dos Bilionários & Gigantes Corporativos",
        target_duration_seconds=72.0,
        voice_config=VoiceConfig(voice_name="pt-BR-AntonioNeural", rate="+5%", pitch="+0Hz"),
        hook=HookBlock(
            hook_text="Você entende de negócios ou apenas consome? 95% das pessoas caem na pegadinha da quinta pergunta!",
            subtitles_highlight="🚨 QUIZ DOS BILIONÁRIOS: CUIDADO COM A #5!",
            duration_seconds=4.0,
            sfx="sfx_whoosh_impact",
        ),
        questions=[
            QuestionItem(
                index=1,
                level="facil",
                level_badge="🟢 NÍVEL FÁCIL",
                question_text="Qual rede social revolucionária foi criada por Mark Zuckerberg em 2004?",
                options=[
                    QuizOption(id="A", text="Twitter"),
                    QuizOption(id="B", text="Facebook"),
                    QuizOption(id="C", text="LinkedIn"),
                    QuizOption(id="D", text="TikTok"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="O Facebook foi lançado no dormitório de Harvard por Mark Zuckerberg em 2004!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=2,
                level="facil",
                level_badge="🟢 NÍVEL FÁCIL",
                question_text="Qual marca de refrigerantes tem sua fórmula trancada em um cofre milionário?",
                options=[
                    QuizOption(id="A", text="Pepsi"),
                    QuizOption(id="B", text="Guaraná Jesus"),
                    QuizOption(id="C", text="Coca-Cola"),
                    QuizOption(id="D", text="Red Bull"),
                ],
                correct_option="C",
                correct_index=2,
                explanation="A fórmula secreta da Coca-Cola está guardada a sete chaves em um cofre em Atlanta!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=3,
                level="medio",
                level_badge="🟡 NÍVEL MÉDIO",
                question_text="Qual gigante do e-commerce começou suas atividades vendendo apenas livros online?",
                options=[
                    QuizOption(id="A", text="Mercado Livre"),
                    QuizOption(id="B", text="Amazon"),
                    QuizOption(id="C", text="Alibaba"),
                    QuizOption(id="D", text="eBay"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="Jeff Bezos fundou a Amazon em 1994 como uma livraria virtual em sua garagem!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=4,
                level="medio",
                level_badge="🟡 NÍVEL MÉDIO",
                question_text="Em qual país europeu está localizada a sede global da multinacional Nestlé?",
                options=[
                    QuizOption(id="A", text="Alemanha"),
                    QuizOption(id="B", text="Suíça"),
                    QuizOption(id="C", text="Bélgica"),
                    QuizOption(id="D", text="Áustria"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="A multinacional Nestlé foi fundada por Henri Nestlé em Vevey, na Suíça!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=5,
                level="dificil",
                level_badge="🔴 NÍVEL DIFÍCIL - PEGADINHA",
                question_text="Se você comprar 100% das ações preferenciais de uma empresa na bolsa, você assume o controle dela?",
                options=[
                    QuizOption(id="A", text="Sim com certeza"),
                    QuizOption(id="B", text="Depende do CEO"),
                    QuizOption(id="C", text="Não porque não dão voto"),
                    QuizOption(id="D", text="Apenas se for estatal"),
                ],
                correct_option="C",
                correct_index=2,
                explanation="Pegadinha de mercado! Ações preferenciais dão prioridade a dividendos, mas não dão voto!",
                is_trap=True,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(intro="sfx_warning_siren", countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=6,
                level="dificil",
                level_badge="🔴 NÍVEL DIFÍCIL",
                question_text="Qual locadora mundial recusou a oferta de comprar a Netflix por 50 milhões de dólares nos anos 2000?",
                options=[
                    QuizOption(id="A", text="Blockbuster"),
                    QuizOption(id="B", text="Sony"),
                    QuizOption(id="C", text="Hollywood Video"),
                    QuizOption(id="D", text="Yahoo"),
                ],
                correct_option="A",
                correct_index=0,
                explanation="A diretoria da Blockbuster riu da proposta e hoje a Netflix vale centenas de bilhões!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=7,
                level="impossivel",
                level_badge="💀 NÍVEL IMPOSSÍVEL",
                question_text="Além de vender hambúrgueres, qual corporação é uma das maiores donas de imóveis comerciais do mundo?",
                options=[
                    QuizOption(id="A", text="Subway"),
                    QuizOption(id="B", text="McDonald's"),
                    QuizOption(id="C", text="Starbucks"),
                    QuizOption(id="D", text="Burger King"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="O McDonald's lucra principalmente comprando terrenos e alugando os prédios para os franqueados!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
        ],
        micro_curiosity=MicroCuriosityBlock(
            insert_after_question=3,
            title="💡 CURIOSIDADE RELÂMPAGO",
            text="Você sabia? O famoso logotipo Swoosh da Nike foi criado por uma estudante de design por apenas 35 dólares em 1971!",
            duration_seconds=4.0,
            sfx="sfx_curiosity_bell",
        ),
        score_cta=ScoreCTABlock(
            text="Quantas dessas gigantes você acertou? Comente seu resultado!",
            duration_seconds=3.0,
        ),
        bonus_question=BonusQuestionBlock(
            index=8,
            badge_label="🔥 PERGUNTA BÔNUS",
            question_text="Steve Jobs e Steve Wozniak venderam quais dois itens pessoais para fundar a Apple? Deixe sua resposta nos comentários!",
            options=["A) Moto e relógio", "B) Van VW e calculadora HP", "C) Violão e TV", "D) 2 computadores antigos"],
            correct_answer_secret="Uma van Volkswagen (Jobs) e uma calculadora científica HP-65 (Wozniak)",
            reveal_in_video=False,
            duration_seconds=6.0,
            pinned_comment="🏆 DESAFIO BÔNUS: Steve Jobs vendeu sua Kombi/van Volkswagen e Steve Wozniak vendeu sua calculadora HP-65 por US$ 500 para fundar a Apple! Quem acertou?",
        ),
        seo=SEOMetadata(
            title="Quiz de Negócios: 95% Caem na Pegadinha da Pergunta 5! Você Consegue?",
            caption="Teste seu conhecimento sobre as maiores empresas e impérios do planeta! Preste atenção na pergunta 5... 👀👇 Qual foi o seu placar? Responda a pergunta bônus nos comentários!",
            hashtags=[
                "#negocios",
                "#quiz",
                "#curiosidades",
                "#quizdark",
                "#bilionarios",
                "#financas",
                "#empreendedorismo",
                "#conhecimento",
                "#fatosdesconhecidos",
                "#bussinessmasterbr",
            ],
            cover_headline="SEGREDOS DOS BILIONÁRIOS: PEGADINHA #5",
        ),
    )


def _build_preset_1830() -> DarkQuizScript:
    """Preset for Slot 18:30 - Prime Time / Supreme IQ Challenge & Impossible Mind Benders."""
    return DarkQuizScript(
        script_id="script_1830_iq_impossible_03",
        slot="18:30",
        theme="Desafio Supremo de QI & Enigmas da Mente",
        target_duration_seconds=72.0,
        voice_config=VoiceConfig(voice_name="pt-BR-AntonioNeural", rate="+5%", pitch="+0Hz"),
        hook=HookBlock(
            hook_text="Teste de QI para mentes rápidas: Apenas 1% das pessoas gabaritam esse quiz. E a pergunta 5 vai bugar seu cérebro!",
            subtitles_highlight="🧠 DESAFIO DE QI: SÓ 1% GABARITA (CUIDADO COM A #5)",
            duration_seconds=4.0,
            sfx="sfx_whoosh_impact",
        ),
        questions=[
            QuestionItem(
                index=1,
                level="facil",
                level_badge="🟢 NÍVEL FÁCIL",
                question_text="Qual é o maior e mais profundo oceano do planeta Terra?",
                options=[
                    QuizOption(id="A", text="Atlântico"),
                    QuizOption(id="B", text="Índico"),
                    QuizOption(id="C", text="Pacífico"),
                    QuizOption(id="D", text="Ártico"),
                ],
                correct_option="C",
                correct_index=2,
                explanation="O Oceano Pacífico cobre mais de um terço de toda a superfície da Terra!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=2,
                level="facil",
                level_badge="🟢 NÍVEL FÁCIL",
                question_text="Qual é o metal prateado e líquido à temperatura ambiente usado em termômetros?",
                options=[
                    QuizOption(id="A", text="Chumbo"),
                    QuizOption(id="B", text="Mercúrio"),
                    QuizOption(id="C", text="Prata"),
                    QuizOption(id="D", text="Alumínio"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="O mercúrio é o único metal elementar que permanece líquido à temperatura ambiente!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=3,
                level="medio",
                level_badge="🟡 NÍVEL MÉDIO",
                question_text="Na geometria clássica, quantos lados tem a figura de um heptágono?",
                options=[
                    QuizOption(id="A", text="6 lados"),
                    QuizOption(id="B", text="7 lados"),
                    QuizOption(id="C", text="8 lados"),
                    QuizOption(id="D", text="9 lados"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="O heptágono é um polígono de exatamente 7 lados e 7 vértices!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=4,
                level="medio",
                level_badge="🟡 NÍVEL MÉDIO",
                question_text="Qual é o gás mais abundante presente na atmosfera da Terra?",
                options=[
                    QuizOption(id="A", text="Oxigênio"),
                    QuizOption(id="B", text="Nitrogênio"),
                    QuizOption(id="C", text="Dióxido de Carbono"),
                    QuizOption(id="D", text="Hélio"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="O nitrogênio compõe cerca de 78% do ar que respiramos!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=5,
                level="dificil",
                level_badge="🔴 NÍVEL DIFÍCIL - PEGADINHA",
                question_text="Um médico receita 3 pílulas e manda tomar uma a cada 30 minutos. Em quantos minutos você toma todas?",
                options=[
                    QuizOption(id="A", text="90 minutos"),
                    QuizOption(id="B", text="60 minutos"),
                    QuizOption(id="C", text="45 minutos"),
                    QuizOption(id="D", text="120 minutos"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="Pegadinha clássica! Você toma a 1ª no minuto 0, a 2ª no minuto 30 e a 3ª no minuto 60!",
                is_trap=True,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(intro="sfx_warning_siren", countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=6,
                level="dificil",
                level_badge="🔴 NÍVEL DIFÍCIL",
                question_text="Qual nação do mundo abrange o maior número de fusos horários oficiais em suas terras e territórios?",
                options=[
                    QuizOption(id="A", text="Rússia"),
                    QuizOption(id="B", text="Estados Unidos"),
                    QuizOption(id="C", text="França"),
                    QuizOption(id="D", text="China"),
                ],
                correct_option="C",
                correct_index=2,
                explanation="A França tem 12 fusos horários diferentes por causa de suas ilhas e territórios ultramarinos!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
            QuestionItem(
                index=7,
                level="impossivel",
                level_badge="💀 NÍVEL IMPOSSÍVEL",
                question_text="Qual é o único osso do corpo humano que não se articula diretamente com nenhum outro osso?",
                options=[
                    QuizOption(id="A", text="Estribo"),
                    QuizOption(id="B", text="Hioide"),
                    QuizOption(id="C", text="Cóccix"),
                    QuizOption(id="D", text="Clavícula"),
                ],
                correct_option="B",
                correct_index=1,
                explanation="O osso hioide fica na base da língua sustentado apenas por músculos e ligamentos!",
                is_trap=False,
                countdown_seconds=3.0,
                audio_cues=QuestionAudioCues(countdown="sfx_tick_tack_3s", reveal="sfx_correct_ding"),
            ),
        ],
        micro_curiosity=MicroCuriosityBlock(
            insert_after_question=3,
            title="💡 CURIOSIDADE RELÂMPAGO",
            text="Você sabia? Potes de mel puro encontrados em tumbas de faraós egípcios de 3 mil anos continuam perfeitamente comestíveis!",
            duration_seconds=4.0,
            sfx="sfx_curiosity_bell",
        ),
        score_cta=ScoreCTABlock(
            text="Seu QI passou no teste? Deixe seu placar registrado nos comentários!",
            duration_seconds=3.0,
        ),
        bonus_question=BonusQuestionBlock(
            index=8,
            badge_label="🔥 PERGUNTA BÔNUS",
            question_text="Numa corrida de rua, se você ultrapassa o corredor que está em segundo lugar, em qual posição você fica? Comente agora sem errar!",
            options=["A) Primeiro lugar", "B) Segundo lugar", "C) Terceiro lugar", "D) Depende do tempo"],
            correct_answer_secret="Segundo lugar! Ao ultrapassar o segundo colocado, você assume a posição dele.",
            reveal_in_video=False,
            duration_seconds=6.0,
            pinned_comment="🏆 DESAFIO BÔNUS: Fica em SEGUNDO LUGAR! Você assumiu o lugar de quem era o segundo colocado! Quem caiu no impulso e respondeu primeiro?",
        ),
        seo=SEOMetadata(
            title="Desafio de QI Nível Máximo: Só 1% Acerta as 7 Perguntas! (#5 é Pegadinha)",
            caption="Desafio extremo de inteligência! 🧠 Quase todo mundo erra a quinta pergunta. Prove que seu raciocínio é fora da curva! Comente seu placar e responda a pergunta bônus! 👇",
            hashtags=[
                "#desafio",
                "#quiz",
                "#qi",
                "#inteligencia",
                "#curiosidades",
                "#quizdark",
                "#conhecimento",
                "#fatosdesconhecidos",
                "#bussinessmasterbr",
            ],
            cover_headline="TESTE DE QI: SÓ 1% ACERTA A #5",
        ),
    )


_PRESETS: Dict[str, Any] = {
    "12:30": _build_preset_1230,
    "16:00": _build_preset_1600,
    "18:30": _build_preset_1830,
}


def list_available_slots() -> List[str]:
    """Returns the list of supported viral time slots."""
    return list(_PRESETS.keys())


def get_preset_script(slot: str) -> DarkQuizScript:
    """Retrieves the calibrated production script for a given time slot."""
    if slot not in _PRESETS:
        raise ValueError(f"Unknown slot '{slot}'. Available slots: {list_available_slots()}")
    builder_fn = _PRESETS[slot]
    return builder_fn()


def generate_quiz_script(
    slot: str,
    theme: Optional[str] = None,
    custom_data: Optional[Dict[str, Any]] = None,
) -> DarkQuizScript:
    """Generates a DarkQuizScript instance either from presets or custom parameters.

    Args:
        slot: Target publishing slot ('12:30', '16:00', '18:30').
        theme: Optional theme override.
        custom_data: Optional dictionary overriding specific fields.

    Returns:
        Validated DarkQuizScript instance.
    """
    if custom_data is not None:
        return DarkQuizScript.from_dict(custom_data)

    script = get_preset_script(slot)
    if theme:
        # Override theme if provided
        data = script.to_dict()
        data["theme"] = theme
        return DarkQuizScript.from_dict(data)

    return script


class DarkQuizGenerator:
    """High-level generator orchestrator for Dark Quiz scripts and guides."""

    def __init__(self, output_dir: Optional[Union[str, Path]] = None) -> None:
        self.output_dir = Path(output_dir) if output_dir is not None else None

    def generate_slot(
        self,
        slot: str = "12:30",
        output_file: Optional[Union[str, Path]] = None,
        theme: Optional[str] = None,
        custom_data: Optional[Dict[str, Any]] = None,
    ) -> DarkQuizScript:
        """Generates a script for a single slot, optionally saving to disk."""
        script = generate_quiz_script(slot, theme=theme, custom_data=custom_data)
        target_path: Optional[Path] = None
        if output_file is not None:
            target_path = Path(output_file)
        elif self.output_dir is not None:
            clean_slot = slot.replace(":", "")
            target_path = self.output_dir / f"script_{clean_slot}.json"

        if target_path is not None:
            script.save_to_file(target_path)

        return script

    def generate_all(self, with_guides: bool = True) -> Dict[str, DarkQuizScript]:
        """Generates scripts for all 3 daily production slots (12:30, 16:00, 18:30)."""
        scripts: Dict[str, DarkQuizScript] = {}
        for slot in list_available_slots():
            clean_slot = slot.replace(":", "")
            out_file = (
                (self.output_dir / f"script_{clean_slot}.json")
                if self.output_dir is not None
                else None
            )
            script = self.generate_slot(slot, output_file=out_file)
            scripts[slot] = script

            if with_guides and self.output_dir is not None:
                from src.scripts.guide_builder import build_markdown_guide

                guide_path = self.output_dir / f"guide_{clean_slot}.md"
                build_markdown_guide(script, output_path=guide_path)

        return scripts


def generate_daily_scripts(
    output_dir: Optional[Union[str, Path]] = None,
) -> Dict[str, DarkQuizScript]:
    """Generates all 3 daily production quiz scripts (12:30, 16:00, 18:30)."""
    gen = DarkQuizGenerator(output_dir=output_dir)
    return gen.generate_all(with_guides=True)


def generate_script(
    slot: str = "12:30",
    output_file: Optional[Union[str, Path]] = None,
    theme: Optional[str] = None,
    custom_data: Optional[Dict[str, Any]] = None,
) -> DarkQuizScript:
    """Generates a single quiz script for the specified slot."""
    gen = DarkQuizGenerator()
    return gen.generate_slot(slot, output_file=output_file, theme=theme, custom_data=custom_data)



def main() -> None:
    """CLI entry point for Dark Quiz script generation."""
    parser = argparse.ArgumentParser(
        description="Dark Quiz Script Generator for @bussinessmasterbr (TikTok >60s)"
    )
    parser.add_argument(
        "--slot",
        choices=["12:30", "16:00", "18:30", "all"],
        default="12:30",
        help="Target publication slot or 'all' to generate all 3 slots",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output path for a single script JSON (e.g. data/scripts/script_1230.json)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="data/scripts",
        help="Directory to save generated scripts (default: data/scripts)",
    )
    parser.add_argument(
        "--with-guide",
        action="store_true",
        help="Also build and save the companion Markdown retention guide",
    )

    args = parser.parse_args()

    # Import guide_builder lazily to avoid circular imports
    from src.scripts.guide_builder import build_retention_guide

    slots_to_generate = list_available_slots() if args.slot == "all" else [args.slot]
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"🎬 Generating Dark Quiz scripts for slot(s): {slots_to_generate}")

    for slot in slots_to_generate:
        script = get_preset_script(slot)
        clean_slot = slot.replace(":", "")

        if args.output and len(slots_to_generate) == 1:
            json_path = Path(args.output)
        else:
            json_path = out_dir / f"script_{clean_slot}.json"

        script.save_to_file(json_path)
        dur = script.estimate_total_duration()
        print(f"  [✓] Script {slot} saved to: {json_path} (Duration: {dur:.1f}s)")

        if args.with_guide or args.output is None or args.slot == "all":
            guide_md = build_retention_guide(script)
            guide_path = out_dir / f"guide_{clean_slot}.md"
            with open(guide_path, "w", encoding="utf-8") as f:
                f.write(guide_md)
            print(f"  [✓] Guide {slot} saved to: {guide_path}")

    print("✨ Script generation completed successfully!")


if __name__ == "__main__":
    main()
