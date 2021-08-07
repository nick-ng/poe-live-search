/**
#defaultcolors:
#uniqueitem rgb(175,96,37)
#rareitem rgb(255,255,119)
#magicitem rgb(136,136,255)
#whiteitem rgb(200,200,200)
#gemitem rgb(27,162,155)
#currencyitem rgb(170,158,130)
#questitem rgb(74,230,58)
#defaultfontsize: 32 (18-45)
 */

const tiers = {
  x32: `
    SetBorderColor 255 0 0
    PlayAlertSound 10 250
    SetFontSize 45
    MinimapIcon 0 Red Circle
    PlayEffect Red
`,
  x16: `
    SetBorderColor 255 170 0
    PlayAlertSound 6 250
    SetFontSize 40
    MinimapIcon 0 Orange Circle
    PlayEffect Orange
`,
  x8: `
    SetBorderColor 184 0 255
    PlayAlertSound 4 250
    SetFontSize 35
    MinimapIcon 0 Purple Circle
    PlayEffect Purple
`,
  x4: `
    SetBorderColor 48 80 255
    PlayAlertSound 3 250
    SetFontSize 30
    MinimapIcon 0 Blue Circle
    PlayEffect Blue
`,
  x2: `
    SetBorderColor 0 216 37
    PlayAlertSound 9 250
    SetFontSize 25
    MinimapIcon 0 Green Circle
    PlayEffect Green
`,
  x1: `
    SetBorderColor 150 150 150
    SetFontSize 20
`,
};

const sixLinkTemplate = () => `
Show
    LinkedSockets = 6
    Corrupted True
#    SetBackgroundColor 190 0 240
    SetBackgroundColor 240 0 200
    SetBorderColor 250 250 250
    SetTextColor 0 0 0
    PlayAlertSound 10 250
    SetFontSize 45
    MinimapIcon 0 Pink Pentagon
    PlayEffect Pink
#tabula exception
Show
    LinkedSockets = 6
    Rarity Unique
    BaseType "Simple Robe"
    SetBackgroundColor 0 200 200
#    SetBackgroundColor 240 0 200
    SetBorderColor 250 250 250
    SetTextColor 0 0 0
    PlayAlertSound 10 250
    SetFontSize 45
    MinimapIcon 0 Red Pentagon
    PlayEffect Cyan
#unique exception
Show
    LinkedSockets = 6
    Rarity Unique
    SetBackgroundColor 250 250 250
    SetBorderColor 0 0 0
    SetTextColor 250 125 0
    PlayAlertSound 6 250
    SetFontSize 45
    MinimapIcon 0 Orange Pentagon
    PlayEffect Orange
#white bg for high ilvl high droplevel 6L's
Show
    LinkedSockets = 6
    DropLevel >= 50
    ItemLevel >= 80
    Class "Body Armour"
    Corrupted False
    SetBackgroundColor 250 250 250
    SetBorderColor 0 0 0
    SetTextColor 0 200 200
    PlayAlertSound 6 250
    SetFontSize 45
    MinimapIcon 0 White Pentagon
    PlayEffect White
#teal bg white border for all others (same as tabula highlight)
Show
    LinkedSockets = 6
    Class "Body Armour"
    Corrupted False
    SetBackgroundColor 0 200 200
    SetBorderColor 250 250 250
    SetTextColor 0 0 0
    PlayAlertSound 10 250
    SetFontSize 45
    MinimapIcon 0 Red Pentagon
    PlayEffect Cyan
#only high droplevel weapons get white bg
Show
    LinkedSockets = 6
    Class "Bow" "Axe" "Sword" "Mace" "Staves"
    ItemLevel >= 64
    Corrupted False
    SetBackgroundColor 250 250 250
    SetBorderColor 0 0 0
    SetTextColor 125 0 0
    PlayAlertSound 6 250
    SetFontSize 45
    MinimapIcon 0 Brown Pentagon
    PlayEffect Brown
#catchall uses same highlighting as corrupted 6L - "divine" style highlihting cause that's usually what it's worth
Show
    LinkedSockets = 6
#    SetBackgroundColor 190 0 240
    SetBackgroundColor 0 200 200
    SetBorderColor 250 250 250
    SetTextColor 0 0 0
    PlayAlertSound 10 250
    SetFontSize 45
    MinimapIcon 0 Brown Pentagon
    PlayEffect Brown
`;

const uniquesOverrideTemplate = () => `
# 5-link uniques
Show
    Rarity Unique
    LinkedSockets >= 5
    SetBorderColor 255 170 0
    PlayAlertSound 6 250
    SetFontSize 40
    MinimapIcon 0 Orange Circle
    PlayEffect Orange

# Replica uniques
Show
    Rarity Unique
    Replica True
    SetBorderColor 255 170 0
    PlayAlertSound 6 250
    SetFontSize 40
    MinimapIcon 0 Orange Circle
    PlayEffect Orange
`;

const uniquesTemplate = (baseTypes, tier) => {
  // #uniqueitem rgb(175,96,37)
  const baseTypeString = baseTypes.map((baseType) => `"${baseType}"`).join(" ");
  return `
# Uniques - ${tier} (${new Date().toISOString().slice(0, 16)})
Show
    Rarity Unique
    BaseType ${baseTypeString}
    SetBackgroundColor 175 96 37
    SetTextColor 255 255 255${tiers[tier]}`;
};

module.exports = {
  sixLinkTemplate,
  uniquesOverrideTemplate,
  uniquesTemplate,
};
