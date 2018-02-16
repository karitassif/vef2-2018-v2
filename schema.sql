CREATE TABLE form (
    id serial primary key,
    date timestamp with time zone not null default current_timestamp,
    name varchar(255) not null,
    email varchar(50) not null,
    ssn varchar(11) not null,
    count integer not null  
);