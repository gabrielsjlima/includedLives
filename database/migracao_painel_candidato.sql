-- Execute uma única vez no banco includedlives_dev. Preserva registros existentes.
ALTER TABLE CANDIDATO ADD COLUMN FOTO_PERFIL MEDIUMBLOB NULL;
ALTER TABLE CANDIDATO ADD COLUMN FOTO_MIME VARCHAR(30) NULL;
