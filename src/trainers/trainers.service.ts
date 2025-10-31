import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { User } from 'src/users/entities/user.entity';
import { use } from 'passport';
import { TrainerQualification } from './entities/qualification.entity';
import { throwError } from 'rxjs';

@Injectable()
export class TrainersService {
 
  constructor(
    @InjectRepository(Trainer)
    private trainersRepository: Repository<Trainer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TrainerQualification)
    private qualiRepository: Repository<TrainerQualification>
  ) {}

  async findAll() {
    return this.trainersRepository.find();
  }

  async findOne(id: string) {
    return this.trainersRepository.findOne({ where: { id } });
  }

  async findByName(name: string) {
    return this.trainersRepository.findOne({ where: { name } });
  }

  async create(data: CreateTrainerDto) {

    const createTrainers = this.trainersRepository.create(data)
    
    return await this.trainersRepository.save(createTrainers)
  }

  async createQuali(idTrainer: string, idUser: any, rating:number) {

    const user = await this.userRepository.findOne({where: {id: idUser}})
    if(!user) throw new NotFoundException("User not found")
    const trainer = await this.trainersRepository.findOne({where: {id: idTrainer}})
    if(!trainer) throw new NotFoundException("The Trainer not exist")

    const existQuali = await this.qualiRepository.findOne({
      where: {trainer: {id: trainer.id}, user: {id: user.id}},
      relations: ["user", "trainer"]
    })


    if(existQuali){
      throw new ForbiddenException("You have already rated this trainer.");
    } else {
    
      if(rating < 1 || rating > 5){
      throw new BadRequestException("The qualification is invalid")
    }

    const qualiCreate = this.qualiRepository.create({
      user,
      trainer,
      rating
    })

    await this.qualiRepository.save(qualiCreate)

   
    const qualiVerify = await this.qualiRepository.find({
      where: {trainer: {id: trainer.id}}
    })


    const average = qualiVerify.length ? qualiVerify.reduce((sum, q)=> sum + Number(q.rating)  ,0) / qualiVerify.length : rating;

    trainer.qualification = parseFloat(average.toFixed(1))
    await this.trainersRepository.save(trainer)

    return {
    message: 'Trainer qualified successfully',
    average: trainer.qualification,
    };
  }

  }

}