CREATE TABLE usuarios(
    id int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    phone varchar(10) not null,
    email varchar(40) not null,
    username varchar(20) not null,
    password varchar(30) not null,
    role int not null,
    UNIQUE KEY (`username`),
    UNIQUE KEY (`email`),
    primary key(id),
    foreign key(role) references roles(id)
);

INSERT INTO usuarios (first_name, last_name, phone, email, username, password, role) 
VALUES ("Emanuel Jesus", "Campo Contreras", "3043502444", "emanuelcxmpo@gmail.com", "emanuelcxmpo", "emanuelc12", 1)

CREATE TABLE tipo_propiedad(
    id int not null auto_increment,
    property varchar(20) not null,
    primary key(id)
);


CREATE TABLE propiedades(
    id int not null auto_increment,
    username int not null,
    name varchar(30) not null,
    property_type int not null,
    address varchar(30) not null,
    description varchar(255) not null,
    num_bedrooms int not null,
    num_bathrooms int not null,
    price int not null,
    observation varchar(255) not null,
    enviroment varchar(20) not null,
    university int not null,
    photo varchar(255) not null,
    photo2 varchar(255) not null,
    photo3 varchar(255),
    photo4 varchar(255),
    photo5 varchar(255),
    primary key(id),
    foreign key(property_type) references tipo_propiedad(id),
    foreign key(university) references universidades(id),
    foreign key(username) references usuarios(id)
);

CREATE TABLE roles(
    id int not null auto_increment,
    role varchar(20) not null,
    primary key(id)
);

CREATE TABLE universidades(
    id int not null auto_increment,
    name varchar(50) not null,
    primary key(id)
);