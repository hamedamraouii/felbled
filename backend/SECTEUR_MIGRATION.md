# Secteur Model Migration

This document describes the implementation of the Secteur model that replaces the string-based secteur field in the User model.

## Changes Made

### 1. Created Secteur Model (`models/secteur.js`)
- Added schema with name, description, image, and categories reference
- Supports both image_url (legacy) and image object (new format)
- References Category model through ObjectIds
- Includes timestamps and proper indexing

### 2. Updated User Model (`models/user.js`)
- Changed secteur field from String to Schema.Types.Mixed with Secteur reference
- Maintained backward compatibility during transition
- Added proper reference to Secteur model

### 3. Enhanced UserController (`controllers/userController.js`)
- Added Secteur model import
- Added secteur validation in createUser and updateUser methods
- Added secteur population in all user queries
- Added new endpoints:
  - `getSecteurs()` - Get all secteurs
  - `getSecteurById(secteurId)` - Get specific secteur with categories
  - `getCategoriesBySecteur(secteurId)` - Get categories for a secteur

### 4. Updated Routes (`routes/userRoutes.js`)
- Added `/api/users/secteurs` - GET all secteurs
- Added `/api/users/secteurs/:secteurId` - GET secteur by ID
- Added `/api/users/secteurs/:secteurId/categories` - GET categories by secteur

## API Endpoints

### Get All Secteurs
```
GET /api/users/secteurs
Response: { success: true, secteurs: [...] }
```

### Get Secteur by ID
```
GET /api/users/secteurs/:secteurId
Response: { success: true, secteur: {...} }
```

### Get Categories by Secteur
```
GET /api/users/secteurs/:secteurId/categories
Response: { success: true, categories: [...], secteur: {...} }
```

## Secteur Data

The following secteurs are available based on the frontend models:

1. EVENEMENTIEL - Services et produits liés aux événements et fêtes
2. SHOPPING - Commerce de détail, vêtements, accessoires
3. GROSSISTE - DEPOT - Commerce de gros et distribution
4. BÂTIMENT - Construction, architecture et travaux publics
5. MÉTIER - Artisanat et métiers manuels
6. MARCHÉ - Commerce alimentaire et produits de première nécessité
7. DROIT - Services juridiques et conseil
8. SÉCURITÉ - Services de sécurité et surveillance
9. EDUCATION - Enseignement et formation
10. SPORT - Activités sportives et récréatives
11. LOISIR - Divertissement et activités de loisir
12. GASTRONOMIE - Restauration et services alimentaires
13. SANTÉ - Services médicaux et paramédicaux
14. INFORMATIQUE - Technologies de l'information et services numériques
15. TOURISME - Hébergement et services touristiques

## Migration Notes

- The secteur field in User model supports both String (legacy) and ObjectId (new)
- Validation checks if secteur is a valid ObjectId reference when provided
- Population includes secteur data in all user queries
- Backward compatibility is maintained during transition period

## Database Setup

Use the `seed-secteurs.js` script to populate the secteur collection:

```bash
MONGO_URI=your_mongodb_connection_string node seed-secteurs.js
```

## Testing

Run the test suite:

```bash
node test-implementation.js
```