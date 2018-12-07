const simple_template = `
{{ image | size = medium | url = https://blable.com/rootToImage.jpeg | title = Chat sur un canapé | description = bobalba bla }}
`;

const template_with_content = `
{{
    text
    | box = note
    | background = warning
    | Ici se trouve une note encadrée dans une box jaune
}}
`;

export const template_in_plain = `
Je suis du plain text et au milieu {{ text | j'ai un template }} à détecter.
`;

export const template_in_template = `
{{ text | j'ai un template {{ text | a l'interieur de moi-même }} a montrer en hover }}
`;

export const template_in_template_in_plain = `
Je suis du plain text et au milieu {{ text | param=par | content=j'ai un template
 {{ text | param=p | a l'interieur de moi-même }} a montrer en hover }} à détecter.
`;

export const real_w_text = `
{{
    templateName
    | param1 = je suis content
    | param2 = align-left
    ||
    Bonjour voici le contenu des tmeplates avec un sub templare {{
        inlinemaths
        | color=blue
        || formule compliquée
    }} avec du display après :
    {{
        image
        | url=cinicrnicr
        | title=image du contenu pour voir plus
    }}
}}
`;

export const real_w_text_w_quotes = `
"
# Un titre h1

On *commence* avec du plain texte

Une liste :
- un
- deux

" {{
    templateName
    | param1 = "je suis content"
    | param2 = "align-left"
    |
    "Bonjour voici le contenu des tmeplates avec un sub templare" {{
        inlinemaths
        | color="blue"
        | "formule compliquée"
    }} "avec du display après :"
    {{
        img
        | src="https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg"
        | "image du contenu pour voir plus"
    }}
}}
"
Puis du texte encore pour continuer
"
`;
