INSERT INTO users(name,email,password)
Values ('Jack Smith','jacksmit@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jack Peralta','peralta@nypd.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Rosa Diaz','rosa@nypd.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id,title,description,thumbnail_photo_url,cover_photo_url ,cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms,country,street,city,province,post_code)
Values(1,'house','text','image','image',120,2,2,3,'Canada','King Edward','Ottawa','Ontario','KFE45D'),
(2,'condo','text','image','image',100,1,1,1,'Canada','King Edward','Ottawa','Ontario','KFE45F'),
(3,'beach house','text','image','image',120,2,2,3,'Canada','Queen Victoria','Ottawa','Ontario','KFE6GT');

INSERT INTO reservations (start_date,end_date,property_id,guest_id)
Values ('2019-08-08','2019-08-10',1,2),
('2019-08-08','2019-08-10',2,3),
('2019-08-08','2019-08-10',3,1);

INSERT INTO property_reviews (guest_id,property_id,reservation_id,rating,message)
Values (2,1,1,5,'message'),
(3,2,2,4,'message'),
(1,3,3,2,'message');
