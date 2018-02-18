# Config


# Front matters

## Articles

```yaml
title: Mon titre # le titre de l'article
category: category # la categorie de l'article (voir les categories dispo dans _data/categories.yml)
meta_description: Une description # le texte utilisé pour la balise seo description et post preview
excerpt: excerpt # le texte utilisé comme fallback pour la balise seo description et le post preview

preview_image: /assets/images/draft/erfklzlkef.jpg # l'image d'un post preview (~600x400)
preview_description: Une description # le texte a afficher dans la preview

hero_image: /assets/images/zefsef.jpg # l'image en haut d'un article (grande taille)

share_image: /assets/image/sdfkjlsifsddf.jpg # l'image utilisée pour le partage (~1024x512)
# la share image est gérée comme ceci:
# share_image, si pas trouvé => preview_image, si pas trouvé => le carré social jam redaction

published: true | false # l'article doit-it apparaitre au public ? true (par defaut) : oui, false : non
tags: # une liste de tags pour l'article
  - un tag
  - un autre tag
date: YYYY-MM-DD hh:mm:ss +zzzz # une date specifique a utiliser comme date de publication de l'article
# format de date:
#   YYYY: l'année sur 4 caratceres (2018)
#   MM: le mois sur 2 caratceres (02)
#   DD: le jour sur 2 caratceres (07)
#   hh: l'heure sur 2 caratceres (22)
#   mm: les minutes sur 2 caratceres (22)
#   ss: les secondes sur 2 caratceres (00)
#   zzzz: le decalage horaire souhaité sur 4 caratceres (+0100 pour gmt+1 par ex)
```

## General



## Page

## Article


# TODO

_config.yml customization
rename image assets !
