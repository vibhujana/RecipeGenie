import requests
import zipfile
import io
import json
from django.core.management.base import BaseCommand
from django.db import connection
from api.models import Ingredient


def table_exists(model):
    return model._meta.db_table in connection.introspection.table_names()

class Command(BaseCommand):
    help = 'Download and load the JSON data into the Ingredients table'

    def handle(self, *args, **options):
        self.download_and_store_json()

    def download_and_store_json(self):
        url = "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2024-04-18.zip"
        json_file_name = "foundationDownload.json"

        if not table_exists(Ingredient) or table_exists(Ingredient):
            try:
                response = requests.get(url)
                response.raise_for_status()

                with zipfile.ZipFile(io.BytesIO(response.content)) as z:
                    for file_info in z.infolist():
                        if file_info.filename == json_file_name:
                            with z.open(file_info) as f:
                                data = json.load(f)
                                ingredient = Ingredient(foundation_foods=data)
                                ingredient.save()
                                self.stdout.write(self.style.SUCCESS('Successfully loaded data into Ingredients table.'))
                                return
                return self.stdout.write(self.style.ERROR('JSON file not found in the zip archive.'))
            except requests.exceptions.RequestException as e:
                return self.stdout.write(self.style.ERROR(f'Failed to download data: {e}'))
            except zipfile.BadZipFile as e:
                return self.stdout.write(self.style.ERROR(f'Failed to extract zip file: {e}'))
        else:
            return self.stdout.write(self.style.ERROR('Ingredients table already has data.'))