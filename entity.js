import {rollDice} from "./utility";
import {mapCols, mapRows} from "./config";
import {tileDictionary, monsterDictionary} from "./tiles";
const Entity = {
  x: 0,
  y: 0,
  type: null
};

let idCounter = 1;

const buildEntity = (level, key, index) => {
  let backgroundVal = level.backgroundMap[index];
  let entityVal = level.entitiesMap[index]
  if(tileDictionary[backgroundVal].passible &&
  tileDictionary[entityVal].passible) {
    let entity = Object.assign({}, Entity, {key, index});
    entity.id = idCounter;
    entity.type = tileDictionary[entity.key].type;
    entity.subtype = tileDictionary[entity.key].subtype;

    idCounter++;
    level.entitiesMap[index] = entity.key;
    level.entities.push(entity);
    // if(tileDictionary[entity.key].type === "player") {
    //   model.state.player = entity;
    // }

    return entity;
  }
};

export const createTextEntity = (text, font, color, x, y) => {
  let entity = Object.assign({}, Entity, {text, font, color, x, y});
  entity.type = "text";

  return entity;
};

export const buildStairs = (level, key, index, targetLevel, targetIndex) => {
  let stairs = buildEntity(level, key, index);
  stairs.target = targetLevel; // not a great name
  stairs.targetIndex = targetIndex;
  return stairs;
};

export const buildMonster = (level, key, index) => {
  let monster = buildEntity(level, key, index);
  let monsterRef = monsterDictionary[monster.subtype];
  monster.hp = rollDice(...monsterRef.hp);
  monster.maxHp = monster.hp;
  monster.xpVal = monsterRef.xpVal;
  monster.damage = monsterRef.damage;
  return monster;
};

export const buildPlayer = (level, key, index) => {
  let player = buildEntity(level, key, index);
  player.hp = 10;
  player.maxHp = 10;
  player.xp = 0;
  player.level = 1;
  player.weapon = {name: "hand", damage: [1,4], verb: "punch"}
  return player;
};

export const removeEntityFromLevel = (level, entity) => {
  level.entitiesMap[entity.index] = 0;
  let index;
  for(let i = 0; i < level.entities.length; i++){
    let e = level.entities[i];
    if(e.id === entity.id){
      index = i;
      break;
    }
  }
  level.entities.splice(index,1);
};

export const getEntityAtIndex = (level, index) => {
  for(let i = 0; i < level.entities.length; i++){
    let entity = level.entities[i];
    if(entity.index === index){
      return entity;
    }
  }
};

export const buildEntityMap = (level) => {
  level.entitiesMap = Array(mapCols * mapRows).fill(0);
  for(let i = 0; i < level.entities.length; i++) {
    let entity = level.entities[i];
    level.entitiesMap[entity.index] = entity.key;
  }
};
