-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema chamada
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`curso` (
  `id_curso` INT(11) NOT NULL AUTO_INCREMENT,
  `nome_curso` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_curso`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`aluno` (
  `id_aluno` INT(11) NOT NULL AUTO_INCREMENT,
  `nome_aluno` VARCHAR(100) NOT NULL,
  `data_nascimento_aluno` DATE NOT NULL,
  `id_curso` INT(11) NOT NULL,
  PRIMARY KEY (`id_aluno`),
  INDEX `curso_idx` (`id_curso` ASC),
  CONSTRAINT `fk_aluno_curso`
    FOREIGN KEY (`id_curso`)
    REFERENCES `mydb`.`curso` (`id_curso`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`carteiraAcesso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`carteiraAcesso` (
  `id_carteiraAcesso` INT(11) NOT NULL AUTO_INCREMENT,
  `validade_carteiraAcesso` DATE NOT NULL,
  `nfc_carteiraAcesso` VARCHAR(10) NOT NULL,
  `id_aluno` INT(11) NOT NULL,
  PRIMARY KEY (`id_carteiraAcesso`),
  INDEX `fk_carteiraAcesso_aluno1_idx` (`id_aluno` ASC),
  CONSTRAINT `fk_carteiraAcesso_aluno1`
    FOREIGN KEY (`id_aluno`)
    REFERENCES `mydb`.`aluno` (`id_aluno`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`professor` (
  `id_professor` INT(11) NOT NULL AUTO_INCREMENT,
  `nome_professor` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_professor`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`disciplina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`disciplina` (
  `id_disciplina` INT(11) NOT NULL AUTO_INCREMENT,
  `nome_disciplina` VARCHAR(45) NOT NULL,
  `carga_horaria_disciplina` INT(11) NOT NULL,
  `semestre_materia` INT(11) NOT NULL,
  `ano_disciplina` INT(4) NOT NULL,
  `presenca_aberta` TINYINT(4) NOT NULL,
  `id_professor` INT(11) NOT NULL,
  `id_curso` INT(11) NOT NULL,
  PRIMARY KEY (`id_disciplina`),
  INDEX `professor_idx` (`id_professor` ASC),
  INDEX `curso_idx` (`id_curso` ASC),
  CONSTRAINT `fk_disciplina_curso`
    FOREIGN KEY (`id_curso`)
    REFERENCES `mydb`.`curso` (`id_curso`),
  CONSTRAINT `fk_disciplina_professor`
    FOREIGN KEY (`id_professor`)
    REFERENCES `mydb`.`professor` (`id_professor`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`presenca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`presenca` (
  `id_presenca` INT(11) NOT NULL AUTO_INCREMENT,
  `data` DATETIME NOT NULL,
  `id_aluno` INT(11) NOT NULL,
  `id_disciplina` INT(11) NOT NULL,
  PRIMARY KEY (`id_presenca`),
  INDEX `fk_presenca_aluno1_idx` (`id_aluno` ASC),
  INDEX `fk_presenca_disciplina1_idx` (`id_disciplina` ASC),
  CONSTRAINT `fk_presenca_aluno1`
    FOREIGN KEY (`id_aluno`)
    REFERENCES `mydb`.`aluno` (`id_aluno`),
  CONSTRAINT `fk_presenca_disciplina1`
    FOREIGN KEY (`id_disciplina`)
    REFERENCES `mydb`.`disciplina` (`id_disciplina`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(50) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `tipo` INT(11) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `token` CHAR(32) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
