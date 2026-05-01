import { Module } from '@nestjs/common';
import { NOTES_REPOSITORY } from './application/ports/notes-repository.port';
import {
  CreateNoteUseCase,
  DeleteNoteUseCase,
  GetAllNotesUseCase,
  GetNoteByIdUseCase,
  UpdateNoteUseCase,
} from './application/use-cases/notes.use-cases';
import { NotesTypeOrmRepository } from './infrastructure/typeorm/notes-typeorm.repository';
import { NotesController } from './presentation/controllers/notes.controller';

@Module({
  controllers: [NotesController],
  providers: [
    CreateNoteUseCase,
    GetAllNotesUseCase,
    GetNoteByIdUseCase,
    UpdateNoteUseCase,
    DeleteNoteUseCase,
    {
      provide: NOTES_REPOSITORY,
      useClass: NotesTypeOrmRepository,
    },
  ],
})
export class NotesModule {}
